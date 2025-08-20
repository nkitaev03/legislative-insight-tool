import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Scale, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  MessageCircle,
  Calendar,
  Building,
  ExternalLink,
  Star,
  Share2,
  Trash2
} from 'lucide-react';
import RiskIndicator from '@/components/common/RiskIndicator';
import { LegislationItem, Recommendation } from './types';
import FeedbackModal from './FeedbackModal';

interface LegislationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: LegislationItem | null;
}

export default function LegislationDetailModal({ 
  isOpen, 
  onClose, 
  item 
}: LegislationDetailModalProps) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  if (!item) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRiskLevelText = (level: 'low' | 'medium' | 'high') => {
    const levels = {
      low: 'Низкий',
      medium: 'Средний', 
      high: 'Высокий'
    };
    return levels[level];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-compBlue-50 dark:bg-compBlue-900/20 rounded-lg">
              <Scale className="w-5 h-5 text-compBlue-600" />
            </div>
            <span className="text-sm font-medium text-compBlue-600">Законодательство</span>
          </div>
          
          <DialogTitle className="text-xl font-semibold leading-tight pr-8">
            <div className="space-y-1">
              <div>{item.title}</div>
              <div className="text-sm text-muted-foreground font-normal">
                № {item.id} от {formatDate(item.date)}
              </div>
              <div className="text-xs text-muted-foreground">
                {item.source}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Что случилось */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-compBlue-600" />
              Что случилось
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </Card>

          {/* Как это влияет */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-compOrange-600" />
              Как это влияет
            </h3>
            
            {/* Новые риски */}
            <div className="space-y-4">
              <h4 className="text-base font-medium text-muted-foreground">Новые риски</h4>
              
              {item.risks && item.risks.length > 0 ? (
                <div className="space-y-3">
                  {item.risks.map((risk, riskIndex) => (
                    <div key={riskIndex} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{risk}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">РЗС-17318</span>
                          <span className="text-xs text-muted-foreground">20.02.2024</span>
                          <Badge variant="secondary" className="text-xs">
                            {getRiskLevelText(item.risk)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Новые риски не выявлены</p>
              )}
            </div>
          </Card>

          {/* Что делать */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-compGreen-600" />
              Что делать
            </h3>
            
            <div className="space-y-3">
              <h4 className="text-base font-medium text-muted-foreground">Меры</h4>
              
              {item.recommendations && item.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {item.recommendations.map((recommendation, index) => (
                    <RecommendationItem key={index} recommendation={recommendation} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <RecommendationItem 
                    recommendation={{
                      text: "Назначить ответственного за обработку персональных данных",
                      responsible: "Не назначен",
                      status: "pending"
                    }}
                  />
                  <RecommendationItem 
                    recommendation={{
                      text: "Провести обучение сотрудников по новым требованиям",
                      responsible: "Не назначен", 
                      status: "pending"
                    }}
                  />
                  <RecommendationItem 
                    recommendation={{
                      text: "Аудит процессов хранения и обработки персональных данных",
                      responsible: "Не назначен",
                      status: "pending"
                    }}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <FeedbackModal 
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function RecommendationItem({ recommendation }: { recommendation: Recommendation }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <div className="p-2 bg-compBlue-100 dark:bg-compBlue-900/30 rounded-lg">
        <FileText className="w-4 h-4 text-compBlue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{recommendation.text}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Ответственный: {recommendation.responsible}
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" className="bg-compGreen-500 hover:bg-compGreen-600 text-white">
          Делать
        </Button>
        <Button variant="ghost" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}