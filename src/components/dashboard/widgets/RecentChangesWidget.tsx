
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Edit, Users, AlertTriangle } from 'lucide-react';

const changes = [
  {
    id: 1,
    type: 'document',
    title: 'Обновлена политика безопасности',
    time: '2 дня назад',
    user: 'Иванов И.И.'
  },
  {
    id: 2,
    type: 'process',
    title: 'Изменен процесс согласования договоров',
    time: '3 дня назад',
    user: 'Петрова А.С.'
  },
  {
    id: 3,
    type: 'risk',
    title: 'Добавлен новый риск-сценарий',
    time: '5 дней назад',
    user: 'Смирнова Е.В.'
  }
];

const RecentChangesWidget: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'process': return <Edit className="h-4 w-4 text-purple-500" />;
      case 'user': return <Users className="h-4 w-4 text-green-500" />;
      case 'risk': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle>Последние изменения</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {changes.map(change => (
            <div key={change.id} className="flex items-start p-2 text-sm rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {getIcon(change.type)}
              </div>
              <div className="flex-1">
                <p>{change.title}</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span>{change.time}</span>
                  <span className="mx-1">•</span>
                  <span>{change.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
};

export default RecentChangesWidget;
