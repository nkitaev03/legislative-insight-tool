
import { LegislationItem, NewsItem } from '../monitoring/types';
import { RiskData } from './types';

/**
 * Fetch risks from the monitoring module
 */
export function getRisksFromMonitoring(): RiskData[] {
  // In a real application, this would likely come from a centralized state or API
  // For demo purposes, we'll define some sample data
  
  const legislationRisks: LegislationItem[] = [
    {
      id: '1',
      title: 'Об изменениях в Федеральном законе "О защите персональных данных"',
      date: '12.05.2023',
      description: 'Ужесточение требований к операторам персональных данных. Введение дополнительных обязанностей по обеспечению безопасности персональных данных и новые штрафы за их невыполнение.',
      category: 'Персональные данные',
      source: 'Государственная Дума РФ',
      sourceUrl: 'https://regulation.gov.ru/example1',
      risk: 'high',
      isNew: true,
      responsible: 'Иванов И.И., Директор IT-отдела',
      risks: [
        'Штрафы до 500 тыс. руб. за несоответствие новым требованиям',
        'Приостановление деятельности до 90 дней при утечке данных',
        'Репутационные риски при публичном раскрытии инцидентов'
      ],
      recommendations: [
        { text: 'Обновить политику обработки персональных данных до 01.06.2023', responsible: '', status: 'pending' },
        { text: 'Провести аудит систем хранения данных клиентов', responsible: '', status: 'pending' },
        { text: 'Назначить ответственного за защиту персональных данных', responsible: '', status: 'pending' }
      ],
      financialImpact: {
        min: 100000,
        max: 500000,
        expected: 350000
      }
    },
    {
      id: '2',
      title: 'Постановление Правительства РФ об учете рабочего времени',
      date: '05.05.2023',
      description: 'Обновленный порядок ведения учета рабочего времени сотрудников. Новые формы отчетности и требования к электронному документообороту.',
      category: 'Трудовое право',
      source: 'Правительство РФ',
      sourceUrl: 'https://regulation.gov.ru/example2',
      risk: 'medium',
      isNew: true,
      responsible: 'Петрова А.С., HR-директор',
      risks: [
        'Штрафы за некорректный учет рабочего времени',
        'Риск судебных исков от сотрудников при невыплате сверхурочных',
        'Административная ответственность при проверке трудовой инспекцией'
      ],
      recommendations: [
        { text: 'Обновить систему учета рабочего времени', responsible: '', status: 'pending' },
        { text: 'Провести обучение HR-специалистов', responsible: '', status: 'pending' },
        { text: 'Внести изменения в правила внутреннего трудового распорядка', responsible: '', status: 'pending' }
      ],
      financialImpact: {
        min: 50000,
        max: 200000,
        expected: 120000
      }
    },
    {
      id: '5',
      title: 'Новые правила маркировки товаров',
      date: '10.04.2023',
      description: 'Расширение перечня товаров, подлежащих обязательной маркировке. Новые сроки внедрения системы маркировки для различных групп товаров.',
      category: 'Торговля',
      source: 'Министерство промышленности и торговли',
      sourceUrl: 'https://regulation.gov.ru/example5',
      risk: 'high',
      isNew: false,
      responsible: 'Никитин В.П., Коммерческий директор',
      risks: [
        'Полный запрет продаж немаркированной продукции с 01.07.2023',
        'Штрафы до 300 тыс. руб. за нарушение правил маркировки',
        'Изъятие товаров без маркировки из оборота'
      ],
      recommendations: [
        { text: 'Зарегистрироваться в системе "Честный ЗНАК"', responsible: '', status: 'pending' },
        { text: 'Приобрести оборудование для считывания кодов маркировки', responsible: '', status: 'pending' },
        { text: 'Обновить учетную систему для работы с маркированными товарами', responsible: '', status: 'pending' }
      ],
      financialImpact: {
        min: 100000,
        max: 300000,
        expected: 180000
      }
    },
  ];
  
  const newsRisks: NewsItem[] = [
    {
      id: 'n1',
      title: 'Центробанк поднял ключевую ставку до 16%',
      date: '15.05.2023',
      description: 'Банк России объявил о повышении ключевой ставки на 2 процентных пункта. Решение принято в связи с ускорением инфляции и необходимостью стабилизации курса рубля.',
      category: 'Экономика',
      source: 'Центральный Банк РФ',
      sourceUrl: 'https://cbr.ru/example1',
      risk: 'high',
      isNew: true,
      responsible: '',
      risks: [
        'Удорожание кредитных ресурсов для бизнеса',
        'Снижение маржинальности по долгосрочным контрактам',
        'Рост стоимости обслуживания кредитного портфеля'
      ],
      recommendations: [
        { text: 'Пересмотреть инвестиционные планы на ближайший квартал', responsible: '', status: 'pending' },
        { text: 'Провести анализ кредитного портфеля компании', responsible: '', status: 'pending' },
        { text: 'Обновить финансовую модель с учетом новых ставок', responsible: '', status: 'pending' }
      ],
      financialImpact: {
        min: 200000,
        max: 750000,
        expected: 450000
      }
    },
    {
      id: 'n2',
      title: 'Рост цен на энергоносители в 2023 году',
      date: '10.05.2023',
      description: 'Аналитики прогнозируют рост цен на электроэнергию и газ для промышленных предприятий на 15-20% в текущем году. Основные причины - инфляция и обновление тарифной политики.',
      category: 'Энергетика',
      source: 'Министерство энергетики',
      sourceUrl: 'https://minenergo.gov.ru/example2',
      risk: 'medium',
      isNew: true,
      responsible: '',
      risks: [
        'Увеличение себестоимости продукции',
        'Снижение конкурентоспособности на внешних рынках',
        'Необходимость пересмотра цен для конечных потребителей'
      ],
      recommendations: [
        { text: 'Внедрить энергосберегающие технологии на производстве', responsible: '', status: 'pending' },
        { text: 'Заключить долгосрочные контракты с поставщиками энергии', responsible: '', status: 'pending' },
        { text: 'Разработать план оптимизации энергопотребления', responsible: '', status: 'pending' }
      ],
      financialImpact: {
        min: 300000,
        max: 500000,
        expected: 420000
      }
    },
  ];
  
  return [...legislationRisks, ...newsRisks];
}
