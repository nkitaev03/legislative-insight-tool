
import React from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const complianceAreas = [
  { 
    id: 1, 
    name: 'Персональные данные', 
    score: 87, 
    status: 'success',
    issues: 1
  },
  { 
    id: 2, 
    name: 'Информационная безопасность', 
    score: 72, 
    status: 'warning',
    issues: 3
  },
  { 
    id: 3, 
    name: 'Финансовая отчетность', 
    score: 93, 
    status: 'success',
    issues: 0
  },
  { 
    id: 4, 
    name: 'Охрана труда', 
    score: 45, 
    status: 'error',
    issues: 5
  }
];

const ComplianceStatusWidget: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-amber-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle>Статус соответствия</CardTitle>
        <CardDescription>Соответствие нормативным требованиям по областям</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complianceAreas.map(area => (
            <div key={area.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {getStatusIcon(area.status)}
                  <span className="ml-2 font-medium">{area.name}</span>
                </div>
                <div className="flex items-center">
                  <span className={`font-bold ${getStatusColor(area.status)}`}>{area.score}%</span>
                  {area.issues > 0 && (
                    <span className="ml-2 text-xs bg-muted py-0.5 px-2 rounded-full">
                      Нарушений: {area.issues}
                    </span>
                  )}
                </div>
              </div>
              <Progress value={area.score} className={getProgressColor(area.score)} />
            </div>
          ))}
          
          <div className="pt-2 text-center">
            <span className="text-sm text-muted-foreground">
              Общий уровень соответствия: <span className="font-medium">76%</span>
            </span>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ComplianceStatusWidget;
