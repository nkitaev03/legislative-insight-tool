
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const notifications = [
  {
    id: 1,
    type: 'warning',
    message: 'Обновление законодательства по персональным данным',
    time: '2 часа назад'
  },
  {
    id: 2,
    type: 'info',
    message: 'Запланировано обновление системы 15.05.2023',
    time: '5 часов назад'
  },
  {
    id: 3,
    type: 'success',
    message: 'Задача "Обновить политику" выполнена',
    time: '1 день назад'
  }
];

const NotificationsWidget: React.FC = () => {
  return (
    <>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Уведомления</CardTitle>
          <Badge variant="outline" className="font-normal">
            <Bell className="h-3 w-3 mr-1" />
            Новых: 2
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map(notification => (
            <div key={notification.id} className="flex items-start p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {notification.type === 'warning' && (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                {notification.type === 'info' && (
                  <Info className="h-5 w-5 text-blue-500" />
                )}
                {notification.type === 'success' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
};

export default NotificationsWidget;
