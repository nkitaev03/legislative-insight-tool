
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from '@/components/ui/separator';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Изменение в законодательстве',
      description: 'Новый закон о защите данных требует обновления политики конфиденциальности',
      time: '2 часа назад',
      isUnread: true,
      priority: 'high',
    },
    {
      id: '2',
      title: 'Срок действия лицензии',
      description: 'Лицензия №123456 истекает через 14 дней',
      time: '5 часов назад',
      isUnread: true,
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Заполнение данных',
      description: 'Требуется заполнить данные о филиалах для анализа',
      time: '1 день назад',
      isUnread: false,
      priority: 'low',
    },
  ]);

  const unreadCount = notifications.filter(n => n.isUnread).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isUnread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isUnread: false })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 pb-2 flex items-center justify-between">
          <h3 className="font-medium">Уведомления</h3>
          {unreadCount > 0 && (
            <button 
              className="text-xs text-compGreen-500 hover:text-compGreen-600"
              onClick={markAllAsRead}
            >
              Отметить все как прочитанные
            </button>
          )}
        </div>
        <Separator />
        <div className="max-h-96 overflow-auto">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "p-4 cursor-pointer hover:bg-muted/50",
                    notification.isUnread && "bg-secondary/50"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          {notification.title}
                          {notification.priority === 'high' && (
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                          {notification.priority === 'medium' && (
                            <span className="inline-block w-2 h-2 bg-compOrange-500 rounded-full"></span>
                          )}
                        </h4>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    {notification.isUnread && (
                      <div className="w-2 h-2 rounded-full bg-compGreen-500"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Нет новых уведомлений
            </div>
          )}
        </div>
        <Separator />
        <div className="p-2">
          <button className="w-full text-sm text-center p-2 hover:bg-muted rounded-md">
            Все уведомления
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
