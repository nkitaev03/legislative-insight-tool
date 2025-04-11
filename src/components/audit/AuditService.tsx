
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, CheckCircle, XCircle, AlertTriangle, BarChart3, Lightbulb, Download } from 'lucide-react';

interface FindingProps {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  recommendations: string[];
  impact?: string;
}

interface AuditResultProps {
  serviceName: string;
  type: 'marketing' | 'sales' | 'finance' | 'process';
  performedBy: string;
  performedDate: string;
  score: number;
  summary: string;
  findings: FindingProps[];
  nextAuditDue?: string;
  recommendations: string[];
}

const AuditService: React.FC<AuditResultProps> = ({
  serviceName,
  type,
  performedBy,
  performedDate,
  score,
  summary,
  findings,
  nextAuditDue,
  recommendations
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      case 'info': return 'bg-green-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Отлично';
    if (score >= 60) return 'Хорошо';
    if (score >= 40) return 'Удовлетворительно';
    return 'Требует улучшения';
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'marketing': return 'bg-purple-100 text-purple-600';
      case 'sales': return 'bg-blue-100 text-blue-600';
      case 'finance': return 'bg-green-100 text-green-600';
      case 'process': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <CardTitle>{serviceName}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <span>Проведено: {performedBy}</span>
              <span>•</span>
              <span>Дата: {performedDate}</span>
              {nextAuditDue && (
                <>
                  <span>•</span>
                  <span>Следующий аудит: {nextAuditDue}</span>
                </>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
              <Badge variant="outline" className={getScoreColor(score)}>
                {getScoreLabel(score)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="findings">Выявленные проблемы</TabsTrigger>
            <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
            <TabsTrigger value="documents">Документы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Краткое резюме</h3>
              <p className="text-sm text-muted-foreground">{summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${getServiceIcon(type)}`}>
                <h3 className="font-medium mb-1">Общая оценка</h3>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold">{score}%</span>
                  <span className="text-sm text-muted-foreground mb-0.5">/ 100%</span>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-50 text-blue-800">
                <h3 className="font-medium mb-1">Найдено проблем</h3>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold">{findings.length}</span>
                  <span className="text-sm text-muted-foreground mb-0.5">шт.</span>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-amber-50 text-amber-800">
                <h3 className="font-medium mb-1">Рекомендаций</h3>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold">{recommendations.length}</span>
                  <span className="text-sm text-muted-foreground mb-0.5">шт.</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Сравнить с прошлым</span>
              </Button>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                <span>Полный отчет</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="findings" className="space-y-4">
            {findings.map((finding) => (
              <div key={finding.id} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(finding.severity)}>
                        <div className="flex items-center gap-1">
                          {getSeverityIcon(finding.severity)}
                          <span className="capitalize">{finding.severity}</span>
                        </div>
                      </Badge>
                    </div>
                    <h3 className="font-medium">{finding.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{finding.description}</p>
                    
                    {finding.impact && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium">Возможное влияние:</h4>
                        <p className="text-sm text-muted-foreground">{finding.impact}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span>Рекомендации:</span>
                  </h4>
                  <ul className="mt-1 space-y-1">
                    {finding.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="min-w-4 mt-1">•</div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg text-amber-800">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                <span>Общие рекомендации по улучшению</span>
              </h3>
              <ul className="space-y-2 mt-3">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-2 bg-white/60 rounded-md">
                    <div className="h-6 w-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{rec}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">Полный отчет аудита</h3>
                    <p className="text-xs text-muted-foreground">PDF, 1.2 MB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">Детализация анализа</h3>
                    <p className="text-xs text-muted-foreground">XLSX, 450 KB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuditService;
