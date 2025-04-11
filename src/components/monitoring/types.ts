
export interface Recommendation {
  text: string;
  responsible: string;
  status: 'pending' | 'completed';
}

export interface FinancialImpact {
  min: number;
  max: number;
  expected: number;
}

export interface LegislationItem {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  source: string;
  sourceUrl: string;
  risk: 'low' | 'medium' | 'high';
  isNew: boolean;
  responsible: string;
  risks: string[];
  recommendations: Recommendation[];
  financialImpact: FinancialImpact;
  strategicImpact?: string;
  implementationDate?: string;
  competitiveAdvantages?: string[];
}

export interface NewsItem extends LegislationItem {}

export interface ItemListProps {
  items: LegislationItem[] | NewsItem[];
  onOpenDialog: (id: string) => void;
  onEditResponsible: (id: string) => void;
  editResponsibleId: string | null;
  handleResponsibleChange: (id: string, responsible: string) => void;
  responsiblePersons: string[];
}
