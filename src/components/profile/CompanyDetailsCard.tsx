import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building, FileText, Globe, Users, Shield, Mail } from 'lucide-react';

interface CompanyDetailsCardProps {
  companyData: any;
}

const CompanyDetailsCard: React.FC<CompanyDetailsCardProps> = ({ companyData }) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle>Информация о компании</CardTitle>
        <CardDescription>Подробные данные о компании {companyData.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Основная информация */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" />
            Основная информация
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Полное наименование компании:</span>
                <p className="font-medium">ООО «Звук»</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Организационно-правовая форма:</span>
                <p className="font-medium">ООО</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Дата основания:</span>
                <p className="font-medium">24.10.2017</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-muted-foreground">ИНН:</span>
                <p className="font-mono font-medium">7708328948</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">ОГРН:</span>
                <p className="font-mono font-medium">5177746117005</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Отрасль и деятельность */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Отрасль и деятельность
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Отрасль компании:</span>
              <p className="font-medium">Цифровые медиа и музыкальные стриминговые услуги, организация мероприятий</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Основной ОКВЭД:</span>
              <p className="font-medium">62.01 — Разработка компьютерного программного обеспечения</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Дополнительные ОКВЭД:</span>
              <p className="font-medium">Пример: 62.02; 62.09; 63.11; 63.11.1; 47.91</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Адреса */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" />
            Адреса
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Юридический адрес:</span>
              <p className="font-medium">101000, г. Москва, вн. тер. г. Муниципальный округ Красносельский, пер. Уланский, д. 22, стр. 1, помещ. 1Н/6</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Фактический адрес (HQ):</span>
              <p className="font-medium">Пример: 121170, г. Москва, пр-т …, оф. … (совпадает с почтовым)</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Города присутствия:</span>
              <p className="font-medium">Пример: Москва; Санкт-Петербург; Казань</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Бизнес-процессы */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Бизнес-процессы
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Краткая карта процессов уровня L2:</span>
              <p className="font-medium">Пример: Контент-менеджмент; Правообладание/лицензирование; Закупки; Продажи B2C/B2B; Маркетинг; Поддержка клиентов; Бухучёт; Налоги; ИТ-платформа; ИБ/ПДн</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Владельцы процессов:</span>
              <p className="font-medium">Пример: Правообладание — Юридический отдел; Продажи B2B — Коммерческий директор; Контент-менеджмент — Руководитель контента; ИТ-платформа — CTO</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Регламенты и SOP (сроки ревизии):</span>
              <p className="font-medium">Пример: Политика модерации контента — ревизия до 2026-03-31; Положение о лицензировании — 2026-06-30; Регламент обработки ПДн — 2026-09-30</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Лицензии и сертификаты */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Лицензии и сертификаты
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Лицензии и сертификаты компании:</span>
              <p className="font-medium">Лицензии на использование контента от правообладателей, сертификаты соответствия законодательству РФ (включая ограничения на запрещённый контент), сертификаты по противодействию экстремизму и коррупции, а также сертификаты управления конфликтами интересов</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Ближайшие дедлайны по продлению:</span>
              <p className="font-medium">Пример: Сертификат по процессам модерации контента — продлить до 2026-12-15</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Регуляторный профиль */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Регуляторный профиль мониторинга
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Контролирующие органы:</span>
              <p className="font-medium">Министерство культуры РФ, Роскомнадзор, Федеральная антимонопольная служба (ФАС), Налоговая служба и уполномоченные банки для расчётов с иностранными дистрибьюторами</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Тематики мониторинга:</span>
              <p className="font-medium">Соблюдение требований о запрете экстремизма, контроль за содержанием контента (в том числе ст. 20.3.3 КоАП РФ), управление конфликтами интересов и санкционный контроль контрагентов, а также соблюдение авторских прав</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Контакты */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Контакты и обновления
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Контакты для уведомлений:</span>
              <p className="font-medium">support@zvuk.com</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Дата последнего обновления профиля:</span>
              <p className="font-medium">2025-08-25</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyDetailsCard;