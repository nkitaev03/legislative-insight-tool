
import { useState, useEffect } from 'react';
import { Play, BarChart3, ArrowRight, Download, RefreshCw, Upload, FileSpreadsheet } from 'lucide-react';
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
import { RiskData, RiskCategory, SimulationResult } from './types';

export default function SimulationPage() {
  const [simulationRun, setSimulationRun] = useState(false);
  const [simulationInProgress, setSimulationInProgress] = useState(false);
  const [companyRisks, setCompanyRisks] = useState<RiskData[]>([]);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hasFinancialReport, setHasFinancialReport] = useState(false);
  
  useEffect(() => {
    // Fetch risks from monitoring module and add risk categories
    const risks = getRisksFromMonitoring();
    
    // Assign risk categories based on the risk type
    const categorizedRisks = risks.map(risk => {
      // Determine risk category based on risk title or description
      let riskCategory: RiskCategory = 'operational';
      
      if (risk.title.toLowerCase().includes('финанс') || risk.description.toLowerCase().includes('финанс')) {
        riskCategory = 'financial';
      } else if (risk.title.toLowerCase().includes('закон') || risk.description.toLowerCase().includes('закон')) {
        riskCategory = 'legal';
      } else if (risk.title.toLowerCase().includes('репутац') || risk.description.toLowerCase().includes('репутац')) {
        riskCategory = 'reputational';
      } else if (risk.title.toLowerCase().includes('стратег') || risk.description.toLowerCase().includes('стратег')) {
        riskCategory = 'strategic';
      }
      
      return {
        ...risk,
        riskCategory
      };
    });
    
    setCompanyRisks(categorizedRisks);
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
          percentile95,
          riskCategory: risk.riskCategory || 'operational'
        };
      });
      
      setSimulationResults(results);
      setSimulationInProgress(false);
      setSimulationRun(true);
    }, 1500);
  };

  const handleFinancialReportUpload = () => {
    // Simulate file upload
    setHasFinancialReport(true);
    
    // Add financial risks from report
    const financialRisks: RiskData[] = [
      {
        id: 'fr1',
        title: 'Снижение маржинальности из-за роста себестоимости',
        date: '15.05.2023',
        description: 'Обнаружен риск снижения рентабельности в 2 квартале из-за роста себестоимости на основные материалы.',
        category: 'Финансы',
        source: 'Финансовый отчет Q1 2023',
        sourceUrl: '#',
        risk: 'high',
        isNew: true,
        responsible: 'Иванов И.И., Финансовый директор',
        risks: [
          'Снижение маржинальности продукции на 5-8%',
          'Уменьшение общей прибыли на 12-15%',
          'Невыполнение плана по EBITDA'
        ],
        recommendations: [
          { text: 'Пересмотреть контракты с поставщиками', responsible: '', status: 'pending' },
          { text: 'Оптимизировать логистические затраты', responsible: '', status: 'pending' },
          { text: 'Рассмотреть альтернативные материалы', responsible: '', status: 'pending' }
        ],
        financialImpact: {
          min: 350000,
          max: 750000,
          expected: 480000
        },
        riskCategory: 'financial'
      },
      {
        id: 'fr2',
        title: 'Рост кредитной нагрузки с повышением ставки ЦБ',
        date: '16.05.2023',
        description: 'Увеличение процентных платежей по кредитному портфелю компании из-за повышения ключевой ставки ЦБ.',
        category: 'Финансы',
        source: 'Финансовый отчет Q1 2023',
        sourceUrl: '#',
        risk: 'medium',
        isNew: true,
        responsible: 'Иванов И.И., Финансовый директор',
        risks: [
          'Увеличение расходов на обслуживание долга',
          'Снижение доступности новых кредитных линий',
          'Рост стоимости финансирования инвестиционных проектов'
        ],
        recommendations: [
          { text: 'Рефинансировать действующие кредиты с фиксированной ставкой', responsible: '', status: 'pending' },
          { text: 'Разработать план снижения долговой нагрузки', responsible: '', status: 'pending' }
        ],
        financialImpact: {
          min: 200000,
          max: 450000,
          expected: 300000
        },
        riskCategory: 'financial'
      }
    ];
    
    setCompanyRisks(prev => [...prev, ...financialRisks]);
  };

  const getTotalRiskExposure = () => {
    if (!simulationResults.length) return 0;
    return simulationResults.reduce((total, result) => total + result.percentile95, 0);
  };

  const filteredResults = selectedCategory === 'all' 
    ? simulationResults 
    : simulationResults.filter(result => result.riskCategory === selectedCategory);

  const getCategoryTotalExposure = (category: RiskCategory) => {
    return simulationResults
      .filter(result => result.riskCategory === category)
      .reduce((total, result) => total + result.percentile95, 0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Симуляция рисков</h1>
        <div className="flex gap-2">
          {!hasFinancialReport && (
            <Button variant="outline" className="gap-2" onClick={handleFinancialReportUpload}>
              <Upload className="h-4 w-4" />
              Загрузить фин. отчет
            </Button>
          )}
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
                {!hasFinancialReport && (
                  <Alert className="bg-compBlue-50 border-compBlue-200 text-compBlue-800 mt-4">
                    <AlertTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Финансовая отчетность не загружена
                    </AlertTitle>
                    <AlertDescription className="text-compBlue-700">
                      Загрузите финансовую отчетность компании для более точного анализа финансовых рисков
                    </AlertDescription>
                  </Alert>
                )}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Распределение рисков по категориям</CardTitle>
                <CardDescription>
                  Финансовое воздействие рисков (95-й процентиль)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {(['financial', 'operational', 'legal', 'strategic', 'reputational'] as RiskCategory[]).map(category => {
                    const exposure = getCategoryTotalExposure(category);
                    const percentage = simulationResults.length 
                      ? (exposure / getTotalRiskExposure()) * 100 
                      : 0;
                    
                    let color = '';
                    switch(category) {
                      case 'financial': color = 'bg-red-500'; break;
                      case 'operational': color = 'bg-blue-500'; break;
                      case 'legal': color = 'bg-purple-500'; break;
                      case 'strategic': color = 'bg-amber-500'; break;
                      case 'reputational': color = 'bg-green-500'; break;
                    }
                    
                    return (
                      <div key={category} className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium capitalize">
                            {category === 'financial' ? 'Финансовые' : 
                             category === 'operational' ? 'Операционные' :
                             category === 'legal' ? 'Юридические' :
                             category === 'strategic' ? 'Стратегические' : 'Репутационные'}
                          </span>
                          <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${color}`} 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 text-right text-sm text-muted-foreground">
                          {exposure.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Распределение воздействия</CardTitle>
                <CardDescription>
                  Распределение финансовых потерь
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <RiskImpactChart simulationResults={simulationResults} />
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="all" className="mt-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">Все риски</TabsTrigger>
                <TabsTrigger value="financial">Финансовые</TabsTrigger>
                <TabsTrigger value="operational">Операционные</TabsTrigger>
                <TabsTrigger value="legal">Юридические</TabsTrigger>
                <TabsTrigger value="strategic">Стратегические</TabsTrigger>
                <TabsTrigger value="reputational">Репутационные</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-6">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Риск</TableHead>
                        <TableHead>Категория</TableHead>
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
                            <TableCell>
                              <Badge className={
                                result.riskCategory === 'financial' ? 'bg-red-500' :
                                result.riskCategory === 'operational' ? 'bg-blue-500' :
                                result.riskCategory === 'legal' ? 'bg-purple-500' :
                                result.riskCategory === 'strategic' ? 'bg-amber-500' :
                                'bg-green-500'
                              }>
                                {result.riskCategory === 'financial' ? 'Финансовый' : 
                                 result.riskCategory === 'operational' ? 'Операционный' :
                                 result.riskCategory === 'legal' ? 'Юридический' :
                                 result.riskCategory === 'strategic' ? 'Стратегический' : 'Репутационный'}
                              </Badge>
                            </TableCell>
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
                        <TableCell></TableCell>
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
            
            {(['financial', 'operational', 'legal', 'strategic', 'reputational'] as RiskCategory[]).map(category => (
              <TabsContent key={category} value={category} className="mt-6">
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
                        {simulationResults
                          .filter(result => result.riskCategory === category)
                          .map((result) => {
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
                        {simulationResults.filter(result => result.riskCategory === category).length > 0 && (
                          <TableRow className="bg-muted/50">
                            <TableCell className="font-medium">Итого по категории</TableCell>
                            <TableCell>
                              {simulationResults
                                .filter(result => result.riskCategory === category)
                                .reduce((sum, r) => sum + r.mean, 0)
                                .toLocaleString('ru-RU')} ₽
                            </TableCell>
                            <TableCell className="font-medium">
                              {getCategoryTotalExposure(category).toLocaleString('ru-RU')} ₽
                            </TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
}
