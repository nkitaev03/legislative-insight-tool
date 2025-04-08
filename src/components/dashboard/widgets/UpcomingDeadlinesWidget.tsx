
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const deadlines = [
  {
    id: 1,
    title: 'Обновить политику конфиденциальности',
    dueDate: '15.05.2023',
    status: 'urgent',
    daysLeft: 2
  },
  {
    id: 2,
    title: 'Провести аудит систем хранения персональных данных',
    dueDate: '30.05.2023',
    status: 'normal',
    daysLeft: 17
  },
  {
    id: 3,
    title: 'Внедрить систему контроля доступа к конфиденциальным данным',
    dueDate: '15.06.2023',
    status: 'normal',
    daysLeft: 33
  }
];

const UpcomingDeadlinesWidget: React.FC = () => {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle>Предстоящие дедлайны</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {deadlines.map(deadline => (
            <div key={deadline.id} className="flex items-start p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {deadline.status === 'urgent' ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CalendarDays className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm">{deadline.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">Срок: {deadline.dueDate}</span>
                  <span 
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      deadline.daysLeft <= 3 
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                        : deadline.daysLeft <= 7
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    )}
                  >
                    {deadline.daysLeft} {deadline.daysLeft === 1 ? 'день' : deadline.daysLeft < 5 ? 'дня' : 'дней'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
};

export default UpcomingDeadlinesWidget;
