
import { useState, useEffect } from 'react';
import { Play, BarChart3, ArrowRight, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import RiskIndicator from '../common/RiskIndicator';
import MonteCarloSimulator from './MonteCarloSimulator';
import RiskImpactChart from './RiskImpactChart';
import { getRisksFromMonitoring } from './utils';
import { RiskData } from './types';

export default function SimulationPage() {
  const [simulationRun, setSimulationRun] = useState(false);
  const [simulationInProgress, setSimulationInProgress] = useState(false);
  const [companyRisks, setCompanyRisks] = useState<RiskData[]>([]);
  const [simulationResults, setSimulationResults] = useState<Array<{
    riskId: string;
    title: string;
    simulations: number[];
    mean: number;
    median: number;
    min: number;
    max: number;
    percentile90: number;
    percentile95: number;
  }>>([]);
  
  useEffect(() => {
    // Fetch risks from monitoring module
    const risks = getRisksFromMonitoring();
    setCompanyRisks(risks);
  }, []);

  const runSimulation = () => {
    setSimulationInProgress(true);
    setSimulationRun(false);
    
    // Simulate asynchronous processing
    setTimeout(() => {
      const results = companyRisks.map(risk => {
        const simulator = new MonteCarloSimulator(risk.financialImpact.min, risk.financialImpact.max);
        const simulations = simulator.runSimulations(1000); // Run 1000 Monte Carlo simulations
        
        // Calculate statistics
        const mean = simulator.calculateMean(simulations);
        const median = simulator.calculateMedian(simulations);
        const min = Math.min(...simulations);
        const max = Math.max(...simulations);
        const percentile90 = simulator.calculatePercentile(simulations, 90);
        const percentile95 = simulator.calculatePercentile(simulations, 95);
        
        return {
          riskId: risk.id,
          title: risk.title,
          simulations,
          mean,
          median,
          min,
          max,
          percentile90,
          percentile95
        };
      });
      
      setSimulationResults(results);
      setSimulationInProgress(false);
      setSimulationRun(true);
    }, 1500);
  };

  const getTotalRiskExposure = () => {
    if (!simulationResults.length) return 0;
    return simulationResults.reduce((total, result) => total + result.percentile95, 0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Симуляция рисков</h1>
        <div className="flex gap-2">
          {simulationRun && (
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Экспорт отчета
            </Button>
          )}
          <Button 
            onClick={runSimulation} 
            disabled={simulationInProgress || companyRisks.length === 0}
            className="gap-2"
          >
            {simulationInProgress ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Расчет...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Запустить симуляцию
              </>
            )}
          </Button>
        </div>
      </div>
      
      {!simulationRun && !simulationInProgress && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Моделирование методом Монте-Карло</CardTitle>
            <CardDescription>
              Запустите симуляцию, чтобы оценить финансовое воздействие выявленных рисков с использованием 
              метода Монте-Карло. Это позволит получить более точную оценку возможных потерь.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4 max-w-md mx-auto text-center">
                <div className="h-24 w-24 bg-compBlue-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-xl font-medium">Выявлено {companyRisks.length} рисков для анализа</h2>
                <p className="text-muted-foreground">
                  Запустите симуляцию, чтобы рассчитать финансовое воздействие каждого риска на бизнес с 
                  учетом вероятностных распределений.
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline">Подробнее о методе</Button>
                  <Button 
                    onClick={runSimulation}
                    disabled={simulationInProgress || companyRisks.length === 0}
                  >
                    Запустить симуляцию
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {simulationRun && (
        <>
          <Card className="bg-compGreen-50 border-compGreen-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-medium text-compGreen-800">Анализ рисков успешно выполнен</h3>
                  <p className="text-compGreen-700 mt-1">
                    Выполнено 1000 симуляций для каждого риска методом Монте-Карло
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-compGreen-700">Общее расчетное воздействие на бизнес (95% доверительный интервал):</p>
                  <p className="text-2xl font-bold text-compGreen-900">
                    {getTotalRiskExposure().toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Распределение рисков</CardTitle>
                <CardDescription>
                  Финансовое воздействие рисков (95-й процентиль)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <RiskImpactChart simulationResults={simulationResults} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Суммарное распределение</CardTitle>
                <CardDescription>
                  Распределение финансовых потерь
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">График суммарного распределения потерь</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="table">
            <TabsList>
              <TabsTrigger value="table">Таблица результатов</TabsTrigger>
              <TabsTrigger value="details">Подробный анализ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table" className="mt-6">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Риск</TableHead>
                        <TableHead>Ожидаемое воздействие</TableHead>
                        <TableHead>95-й процентиль</TableHead>
                        <TableHead>Минимум</TableHead>
                        <TableHead>Максимум</TableHead>
                        <TableHead className="text-right">Уровень риска</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {simulationResults.map((result) => {
                        const risk = companyRisks.find(r => r.id === result.riskId);
                        return (
                          <TableRow key={result.riskId}>
                            <TableCell className="font-medium">{result.title}</TableCell>
                            <TableCell>{result.mean.toLocaleString('ru-RU')} ₽</TableCell>
                            <TableCell className="font-medium">{result.percentile95.toLocaleString('ru-RU')} ₽</TableCell>
                            <TableCell>{result.min.toLocaleString('ru-RU')} ₽</TableCell>
                            <TableCell>{result.max.toLocaleString('ru-RU')} ₽</TableCell>
                            <TableCell className="text-right">
                              {risk && <RiskIndicator level={risk.risk} showLabel />}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-medium">Общее воздействие</TableCell>
                        <TableCell>
                          {simulationResults.reduce((sum, r) => sum + r.mean, 0).toLocaleString('ru-RU')} ₽
                        </TableCell>
                        <TableCell className="font-medium">
                          {getTotalRiskExposure().toLocaleString('ru-RU')} ₽
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6 space-y-6">
              {simulationResults.map((result) => {
                const risk = companyRisks.find(r => r.id === result.riskId);
                if (!risk) return null;
                
                return (
                  <Card key={result.riskId}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{risk.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {risk.category} • Источник: {risk.source}
                          </CardDescription>
                        </div>
                        <RiskIndicator level={risk.risk} showLabel />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Описание риска</h4>
                        <p className="text-sm text-muted-foreground">{risk.description}</p>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Ожидаемое воздействие</h4>
                          <p className="text-lg font-bold">{result.mean.toLocaleString('ru-RU')} ₽</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">95-й процентиль</h4>
                          <p className="text-lg font-bold text-red-600">{result.percentile95.toLocaleString('ru-RU')} ₽</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Диапазон воздействия</h4>
                          <p className="text-sm">
                            от <span className="font-bold">{result.min.toLocaleString('ru-RU')} ₽</span> до <span className="font-bold">{result.max.toLocaleString('ru-RU')} ₽</span>
                          </p>
                        </div>
                      </div>
                      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                        <AlertTitle className="text-blue-800">Рекомендации по снижению риска</AlertTitle>
                        <AlertDescription className="text-blue-700">
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            {risk.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec.text}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
