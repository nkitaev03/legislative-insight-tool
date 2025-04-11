
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { ChartContainer } from '@/components/ui/chart';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { Building, Briefcase, TrendingUp, Tag, FolderTree, Package, Users, FileText, ChevronDown, ChevronRight } from 'lucide-react';

interface CompanyDetailsCardProps {
  companyData: {
    name: string;
    description: string;
    industry: string;
    macroIndicators: {
      name: string;
      value: number;
      industry: number;
      unit: string;
    }[];
    brands: string[];
    subsidiaries: Subsidiary[];
    products: string[];
    management: Person[];
    owners: {
      name: string;
      share: number;
    }[];
    details: {
      inn: string;
      ogrn: string;
      registrationDate: string;
      legalAddress: string;
      authorizedCapital: string;
    };
  };
}

interface Subsidiary {
  id: string;
  name: string;
  ownership: number;
  children?: Subsidiary[];
}

interface Person {
  name: string;
  position: string;
  since: string;
}

const CompanyDetailsCard: React.FC<CompanyDetailsCardProps> = ({ companyData }) => {
  const [expandedSubsidiary, setExpandedSubsidiary] = useState<string | null>(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  // Function to render the subsidiary tree
  const renderSubsidiaryTree = (subsidiaries: Subsidiary[], level = 0) => {
    return (
      <ul className={`pl-${level > 0 ? '4' : '0'} space-y-1`}>
        {subsidiaries.map((subsidiary) => (
          <li key={subsidiary.id} className="py-1">
            <div 
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer ${expandedSubsidiary === subsidiary.id ? 'bg-muted/50' : ''}`}
              onClick={() => setExpandedSubsidiary(expandedSubsidiary === subsidiary.id ? null : subsidiary.id)}
            >
              {subsidiary.children && subsidiary.children.length > 0 ? (
                expandedSubsidiary === subsidiary.id ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )
              ) : (
                <div className="w-4" />
              )}
              <span>{subsidiary.name}</span>
              <Badge variant="outline" className="ml-auto">
                {subsidiary.ownership}%
              </Badge>
            </div>
            
            {expandedSubsidiary === subsidiary.id && subsidiary.children && subsidiary.children.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {renderSubsidiaryTree(subsidiary.children, level + 1)}
              </motion.div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle>Информация о компании</CardTitle>
        <CardDescription>Подробные данные о компании {companyData.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="w-full grid grid-cols-4 h-auto">
            <TabsTrigger value="general" className="py-2 flex gap-2 items-center">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Общая информация</span>
              <span className="sm:hidden">Общая</span>
            </TabsTrigger>
            <TabsTrigger value="structure" className="py-2 flex gap-2 items-center">
              <FolderTree className="h-4 w-4" />
              <span className="hidden sm:inline">Структура</span>
              <span className="sm:hidden">Структура</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="py-2 flex gap-2 items-center">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Продукты и бренды</span>
              <span className="sm:hidden">Продукты</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="py-2 flex gap-2 items-center">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Реквизиты</span>
              <span className="sm:hidden">Реквизиты</span>
            </TabsTrigger>
          </TabsList>
          
          {/* General Information Tab */}
          <TabsContent value="general" className="space-y-4">
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={childVariants}>
                <div className="flex items-start gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Описание деятельности:</h3>
                    <p className="text-muted-foreground">{companyData.description}</p>
                  </div>
                </div>
              </motion.div>
              
              <Separator />
              
              <motion.div variants={childVariants}>
                <div className="flex items-start gap-2">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Отрасль:</h3>
                    <Badge variant="secondary" className="mt-1">
                      {companyData.industry}
                    </Badge>
                  </div>
                </div>
              </motion.div>
              
              <Separator />
              
              <motion.div variants={childVariants} className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Макроэкономические показатели по отрасли:</h3>
                </div>
                
                <div className="h-64 w-full">
                  <ChartContainer config={{ company: { color: '#8884d8' }, industry: { color: '#82ca9d' } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={companyData.macroIndicators}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip formatter={(value: any) => [`${value} ${companyData.macroIndicators.find(i => i.value === value || i.industry === value)?.unit || ''}`]} />
                        <Bar dataKey="value" name="Компания" fill="var(--color-company)" />
                        <Bar dataKey="industry" name="Среднее по отрасли" fill="var(--color-industry)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          {/* Structure Tab */}
          <TabsContent value="structure" className="space-y-4">
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={childVariants}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="management">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Структура управления</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {companyData.management.map((person, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                            <div>
                              <div className="font-medium">{person.name}</div>
                              <div className="text-sm text-muted-foreground">{person.position}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              c {person.since}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="ownership">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Структура собственности</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="h-64 w-full">
                          <ChartContainer config={{ ownership: { color: '#8884d8' } }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={companyData.owners}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis unit="%" domain={[0, 100]} />
                                <Tooltip formatter={(value: any) => `${value}%`} />
                                <Line type="monotone" dataKey="share" stroke="var(--color-ownership)" activeDot={{ r: 8 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {companyData.owners.map((owner, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                              <div className="font-medium">{owner.name}</div>
                              <Badge>{owner.share}%</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="subsidiaries">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <FolderTree className="h-4 w-4" />
                        <span>Дочерние компании</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2">
                        {renderSubsidiaryTree(companyData.subsidiaries)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          {/* Products and Brands Tab */}
          <TabsContent value="products" className="space-y-4">
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden" 
              animate="visible"
            >
              <motion.div variants={childVariants}>
                <div className="flex items-start gap-2">
                  <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="w-full">
                    <h3 className="font-medium mb-2">Торговые марки и бренды:</h3>
                    <div className="flex flex-wrap gap-2">
                      {companyData.brands.map((brand, idx) => (
                        <Badge key={idx} variant="outline" className="px-3 py-1">
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <Separator />
              
              <motion.div variants={childVariants}>
                <div className="flex items-start gap-2">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="w-full">
                    <h3 className="font-medium mb-2">Основные продукты:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {companyData.products.map((product, idx) => (
                        <div key={idx} className="p-2 bg-muted/30 rounded-md">{product}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={childVariants}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">ИНН:</span>
                      <span className="font-mono font-medium">{companyData.details.inn}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">ОГРН:</span>
                      <span className="font-mono font-medium">{companyData.details.ogrn}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Дата регистрации:</span>
                      <span>{companyData.details.registrationDate}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Юридический адрес:</span>
                      <span>{companyData.details.legalAddress}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Уставный капитал:</span>
                      <span>{companyData.details.authorizedCapital}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <Separator />
              
              <motion.div variants={childVariants}>
                <div className="p-4 bg-muted/30 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>Выписка из ЕГРЮЛ</span>
                  </div>
                  <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
                    Скачать
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompanyDetailsCard;
