
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Percent, TrendingUp, TrendingDown } from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';

const KpiWidget: React.FC = () => {
  return (
    <div className="space-y-4">
      <CardHeader className="pb-2">
        <CardTitle>Ключевые показатели</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard 
            title="Прибыль Q2 2023"
            value="12.7M₽"
            icon={<DollarSign className="h-5 w-5" />}
            description="План: 12.4M₽"
            trend={{ value: 8, isPositive: true }}
            variant="success"
          />
          <MetricCard 
            title="Маржинальность"
            value="18.2%"
            icon={<Percent className="h-5 w-5" />}
            description="Прошлый квартал: 17.5%"
            trend={{ value: 4, isPositive: true }}
            variant="success"
          />
        </div>
      </CardContent>
    </div>
  );
};

export default KpiWidget;
