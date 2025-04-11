import React, { useState } from 'react';
import { User, Building, Mail, Phone, MapPin, Shield, FileText, Settings, CalendarClock, FileUp, FileCheck, Globe, Users, ShoppingBag, X, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FileUploader from '../common/FileUploader';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CompanyDetailsCard from './CompanyDetailsCard';
import { companyData } from './CompanyData';

interface CompanyInfo {
  name: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  business: string;
  geography: string;
  products: string[];
  clients: string[];
  market: string;
}

interface LawResponsibility {
  id: string;
  law: string;
  department: string;
  responsible: string;
  deadline: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'ООО "ТехноПром"',
    position: 'Генеральный директор',
    email: 'director@technoprom.ru',
    phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Тверская, 1',
    business: 'Разработка программного обеспечения',
    geography: 'Россия, СНГ, Восточная Европа',
    products: ['Облачные решения для бизнеса', 'ERP системы', 'CRM решения', 'Мобильные приложения'],
    clients: ['Малый бизнес', 'Средний бизнес', 'Корпоративные клиенты'],
    market: 'B2B, IT-решения для оптимизации бизнес-процессов'
  });

  const [responsibleLaws, setResponsibleLaws] = useState<LawResponsibility[]>([
    {
      id: '1',
      law: 'ФЗ "О персональных данных"',
      department: 'Юридический отдел',
      responsible: 'Иванов И.И.',
      deadline: '01.06.2023'
    },
    {
      id: '2',
      law: 'ФЗ "О защите прав потребителей"',
      department: 'Отдел продаж',
      responsible: 'Петров П.П.',
      deadline: '15.05.2023'
    },
    {
      id: '3',
      law: 'ФЗ "О бухгалтерском учете"',
      department: 'Бухгалтерия',
      responsible: 'Сидорова А.А.',
      deadline: '10.06.2023'
    }
  ]);

  const [newResponsible, setNewResponsible] = useState({
    law: '',
    department: '',
    responsible: '',
    deadline: ''
  });

  const [newProduct, setNewProduct] = useState('');
  const [newClient, setNewClient] = useState('');
  
  const handleAddProduct = () => {
    if (newProduct.trim()) {
      setCompanyInfo({
        ...companyInfo,
        products: [...companyInfo.products, newProduct.trim()]
      });
      setNewProduct('');
      toast.success('Продукт добавлен');
    }
  };
  
  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...companyInfo.products];
    updatedProducts.splice(index, 1);
    setCompanyInfo({
      ...companyInfo,
      products: updatedProducts
    });
    toast.success('Продукт удален');
  };
  
  const handleAddClient = () => {
    if (newClient.trim()) {
      setCompanyInfo({
        ...companyInfo,
        clients: [...companyInfo.clients, newClient.trim()]
      });
      setNewClient('');
      toast.success('Клиент добавлен');
    }
  };
  
  const handleRemoveClient = (index: number) => {
    const updatedClients = [...companyInfo.clients];
    updatedClients.splice(index, 1);
    setCompanyInfo({
      ...companyInfo,
      clients: updatedClients
    });
    toast.success('Клиент удален');
  };

  const handleAddResponsible = () => {
    if (newResponsible.law && newResponsible.responsible) {
      setResponsibleLaws([
        ...responsibleLaws,
        {
          id: Date.now().toString(),
          ...newResponsible
        }
      ]);
      setNewResponsible({
        law: '',
        department: '',
        responsible: '',
        deadline: ''
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Личный кабинет</h1>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-background border">
          <TabsTrigger value="personal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Личная информация</TabsTrigger>
          <TabsTrigger value="company" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Информация о компании</TabsTrigger>
          <TabsTrigger value="company-files" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Документы</TabsTrigger>
          <TabsTrigger value="responsibilities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Ответственные</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Настройки</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle>Персональный профиль</CardTitle>
              <CardDescription>Информация о владельце аккаунта</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl bg-compGreen-500 text-white">ИП</AvatarFallback>
                  </Avatar>
                  <button className="text-sm px-3 py-1 bg-compGreen-500 text-white rounded-md hover:bg-compGreen-600 transition-colors">
                    Изменить фото
                  </button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Имя</label>
                      <div className="flex items-center gap-2 mt-1 border p-2 rounded-md">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Иванов Петр Алексеевич</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Должность</label>
                      <div className="flex items-center gap-2 mt-1 border p-2 rounded-md">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{companyInfo.position}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <div className="flex items-center gap-2 mt-1 border p-2 rounded-md">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{companyInfo.email}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Телефон</label>
                      <div className="flex items-center gap-2 mt-1 border p-2 rounded-md">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{companyInfo.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 px-4 py-2 bg-compGreen-500 text-white rounded-md hover:bg-compGreen-600 transition-colors">
                    Редактировать профиль
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="company" className="space-y-4">
          {/* Import CompanyDetailsCard at the top of the file */}
          {/* import CompanyDetailsCard from './CompanyDetailsCard'; */}
          {/* import { companyData } from './CompanyData'; */}
          <CompanyDetailsCard companyData={companyData} />
          
          {/* Removed redundant additional information section as it's now integrated in the CompanyDetailsCard component */}
        </TabsContent>

        <TabsContent value="company-files" className="space-y-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle>Документы компании</CardTitle>
              <CardDescription>Загрузите и управляйте документами</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="business" className="space-y-4">
                <TabsList className="bg-muted/50 w-full grid grid-cols-3 h-auto p-1">
                  <TabsTrigger value="business" className="py-2">Бизнес-планы</TabsTrigger>
                  <TabsTrigger value="finance" className="py-2">Финансы</TabsTrigger>
                  <TabsTrigger value="legal" className="py-2">Юридические</TabsTrigger>
                </TabsList>
                
                <TabsContent value="business" className="space-y-4">
                  <FileUploader 
                    title="Бизнес-планы и прототипы"
                    accepted=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png"
                    maxSize={15}
                  />
                </TabsContent>
                
                <TabsContent value="finance" className="space-y-4">
                  <FileUploader 
                    title="Финансовые документы"
                    accepted=".pdf,.xls,.xlsx,.csv"
                    maxSize={15}
                  />
                </TabsContent>
                
                <TabsContent value="legal" className="space-y-4">
                  <FileUploader 
                    title="Юридические документы"
                    accepted=".pdf,.doc,.docx"
                    maxSize={15}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="responsibilities" className="space-y-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle>Ответственные по законам</CardTitle>
              <CardDescription>Назначение ответственных сотрудников</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Добавить ответственного</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Закон/НПА</label>
                      <input 
                        type="text" 
                        className="w-full mt-1 p-2 border rounded-md"
                        value={newResponsible.law}
                        onChange={(e) => setNewResponsible({...newResponsible, law: e.target.value})}
                        placeholder="Введите название закона"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Отдел</label>
                      <input 
                        type="text" 
                        className="w-full mt-1 p-2 border rounded-md"
                        value={newResponsible.department}
                        onChange={(e) => setNewResponsible({...newResponsible, department: e.target.value})}
                        placeholder="Введите название отдела"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ответственное лицо</label>
                      <input 
                        type="text" 
                        className="w-full mt-1 p-2 border rounded-md"
                        value={newResponsible.responsible}
                        onChange={(e) => setNewResponsible({...newResponsible, responsible: e.target.value})}
                        placeholder="ФИО"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Срок исполнения</label>
                      <input 
                        type="text" 
                        className="w-full mt-1 p-2 border rounded-md"
                        value={newResponsible.deadline}
                        onChange={(e) => setNewResponsible({...newResponsible, deadline: e.target.value})}
                        placeholder="ДД.ММ.ГГГГ"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleAddResponsible}
                    className="mt-4 px-4 py-2 bg-compGreen-500 text-white rounded-md hover:bg-compGreen-600 transition-colors"
                  >
                    Добавить
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="p-2">Закон/НПА</th>
                        <th className="p-2">Отдел</th>
                        <th className="p-2">Ответственное лицо</th>
                        <th className="p-2">Срок исполнения</th>
                        <th className="p-2">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responsibleLaws.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-2">{item.law}</td>
                          <td className="p-2">{item.department}</td>
                          <td className="p-2">{item.responsible}</td>
                          <td className="p-2">{item.deadline}</td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <button className="p-1 text-blue-500 hover:text-blue-700 transition-colors">
                                Изменить
                              </button>
                              <button 
                                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                onClick={() => setResponsibleLaws(responsibleLaws.filter(law => law.id !== item.id))}
                              >
                                Удалить
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle>Настройки</CardTitle>
              <CardDescription>Настройки личного кабинета</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Уведомления</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email-уведомления</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-compGreen-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>SMS-уведомления</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-compGreen-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Безопасность</h3>
                <div className="mt-2">
                  <button className="w-full py-2 border rounded-md flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                    <Shield className="h-4 w-4" />
                    <span>Изменить пароль</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
