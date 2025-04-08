
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RiskData } from './types';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

interface SimulationParametersFormProps {
  risks: RiskData[];
  onRunSimulation: (parameters: SimulationParameters) => void;
  isRunning: boolean;
}

export interface SimulationParameters {
  selectedRisks: string[];
  simulationRuns: number;
  confidenceLevel: number;
  distributionType: "normal" | "triangular" | "uniform";
  includeCorrelations: boolean;
  stressTestCoefficient: number;
  customParameterAdjustments: Record<string, {min: number, max: number}>;
}

const SimulationParametersForm: React.FC<SimulationParametersFormProps> = ({
  risks,
  onRunSimulation,
  isRunning
}) => {
  const [parameters, setParameters] = useState<SimulationParameters>({
    selectedRisks: risks.map(r => r.id),
    simulationRuns: 1000,
    confidenceLevel: 95,
    distributionType: "triangular",
    includeCorrelations: false,
    stressTestCoefficient: 1.0,
    customParameterAdjustments: {}
  });

  const [customizing, setCustomizing] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof SimulationParameters, value: any) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRiskSelection = (riskId: string, selected: boolean) => {
    setParameters(prev => ({
      ...prev,
      selectedRisks: selected 
        ? [...prev.selectedRisks, riskId] 
        : prev.selectedRisks.filter(id => id !== riskId)
    }));
  };

  const handleCustomParameterChange = (riskId: string, field: 'min' | 'max', value: number) => {
    setParameters(prev => ({
      ...prev,
      customParameterAdjustments: {
        ...prev.customParameterAdjustments,
        [riskId]: {
          ...prev.customParameterAdjustments[riskId] || 
          { min: risks.find(r => r.id === riskId)?.financialImpact.min || 0, 
            max: risks.find(r => r.id === riskId)?.financialImpact.max || 0 },
          [field]: value
        }
      }
    }));
  };

  const toggleCustomization = (riskId: string) => {
    setCustomizing(prev => {
      const newState = { ...prev, [riskId]: !prev[riskId] };
      
      // Initialize custom parameters if not already present
      if (newState[riskId] && !parameters.customParameterAdjustments[riskId]) {
        const risk = risks.find(r => r.id === riskId);
        if (risk) {
          handleCustomParameterChange(riskId, 'min', risk.financialImpact.min);
          handleCustomParameterChange(riskId, 'max', risk.financialImpact.max);
        }
      }
      
      return newState;
    });
  };

  const runSimulation = () => {
    onRunSimulation(parameters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Параметры симуляции</CardTitle>
        <CardDescription>
          Настройте параметры моделирования методом Монте-Карло для более точного анализа рисков
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Выбор рисков для анализа</Label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {risks.map((risk) => (
                <div key={risk.id} className="flex items-center space-x-2">
                  <Switch 
                    checked={parameters.selectedRisks.includes(risk.id)} 
                    onCheckedChange={(checked) => handleRiskSelection(risk.id, checked)} 
                    id={`risk-${risk.id}`}
                  />
                  <Label htmlFor={`risk-${risk.id}`} className="flex-1 text-sm">
                    {risk.title.length > 40 ? risk.title.substring(0, 40) + '...' : risk.title}
                  </Label>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleCustomization(risk.id)}
                    className="h-6 px-2"
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    <span className="text-xs">Настроить</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            {risks.map((risk) => customizing[risk.id] && (
              <Card key={`customize-${risk.id}`} className="p-3 bg-muted/30">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm font-medium">{risk.title}</span>
                  <Badge variant="outline">{risk.riskCategory}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor={`min-${risk.id}`} className="text-xs">
                      Минимальное воздействие (₽)
                    </Label>
                    <Input
                      id={`min-${risk.id}`}
                      type="number"
                      value={parameters.customParameterAdjustments[risk.id]?.min || risk.financialImpact.min}
                      onChange={(e) => handleCustomParameterChange(risk.id, 'min', Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`max-${risk.id}`} className="text-xs">
                      Максимальное воздействие (₽)
                    </Label>
                    <Input
                      id={`max-${risk.id}`}
                      type="number"
                      value={parameters.customParameterAdjustments[risk.id]?.max || risk.financialImpact.max}
                      onChange={(e) => handleCustomParameterChange(risk.id, 'max', Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Количество симуляций</Label>
                <span className="text-sm text-muted-foreground">{parameters.simulationRuns}</span>
              </div>
              <Slider
                value={[parameters.simulationRuns]}
                min={100}
                max={10000}
                step={100}
                onValueChange={(value) => handleChange('simulationRuns', value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100</span>
                <span>10000</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Доверительный интервал</Label>
                <span className="text-sm text-muted-foreground">{parameters.confidenceLevel}%</span>
              </div>
              <Slider
                value={[parameters.confidenceLevel]}
                min={80}
                max={99}
                step={1}
                onValueChange={(value) => handleChange('confidenceLevel', value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>80%</span>
                <span>99%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Тип распределения</Label>
              <Select 
                value={parameters.distributionType}
                onValueChange={(value: "normal" | "triangular" | "uniform") => handleChange('distributionType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Тип распределения" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Нормальное</SelectItem>
                  <SelectItem value="triangular">Треугольное</SelectItem>
                  <SelectItem value="uniform">Равномерное</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Коэффициент стресс-теста</Label>
                <span className="text-sm text-muted-foreground">×{parameters.stressTestCoefficient.toFixed(1)}</span>
              </div>
              <Slider
                value={[parameters.stressTestCoefficient * 10]}
                min={8}
                max={20}
                step={1}
                onValueChange={(value) => handleChange('stressTestCoefficient', value[0] / 10)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>×0.8</span>
                <span>×2.0</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="include-correlations"
                checked={parameters.includeCorrelations}
                onCheckedChange={(checked) => handleChange('includeCorrelations', checked)}
              />
              <Label htmlFor="include-correlations">Учитывать корреляции между рисками</Label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={runSimulation} disabled={isRunning}>
            {isRunning ? 'Выполняется расчет...' : 'Запустить симуляцию'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationParametersForm;
