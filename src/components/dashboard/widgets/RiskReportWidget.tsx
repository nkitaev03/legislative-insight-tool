
import React from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const riskData = [
  { category: 'Финансовые', high: 14, medium: 8, low: 6 },
  { category: 'Юридические', high: 8, medium: 12, low: 5 },
  { category: 'Операционные', high: 5, medium: 9, low: 15 },
  { category: 'Технологические', high: 7, medium: 11, low: 9 },
];

const RiskReportWidget: React.FC = () => {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle>Отчет по рискам</CardTitle>
        <CardDescription>Распределение рисков по категориям и уровням важности</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={riskData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  return [value, name === 'high' ? 'Высокий' : name === 'medium' ? 'Средний' : 'Низкий'];
                }}
              />
              <Legend 
                formatter={(value) => (
                  value === 'high' ? 'Высокий' : 
                  value === 'medium' ? 'Средний' : 'Низкий'
                )}
              />
              <Bar 
                dataKey="high" 
                stackId="a" 
                fill="#f44336" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="medium" 
                stackId="a" 
                fill="#ff9800"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="low" 
                stackId="a" 
                fill="#2a9e31"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </>
  );
};

export default RiskReportWidget;
