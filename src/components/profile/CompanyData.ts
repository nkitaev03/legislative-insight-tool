
// Sample data for the company details card
export const companyData = {
  name: 'ООО "ТехноПром"',
  description: 'Разработка и внедрение программного обеспечения для оптимизации бизнес-процессов, создание CRM и ERP систем, разработка облачных решений и мобильных приложений для корпоративных клиентов.',
  industry: 'Информационные технологии',
  macroIndicators: [
    { name: 'Рост рынка', value: 12.5, industry: 8.3, unit: '%' },
    { name: 'Рентабельность', value: 18.7, industry: 15.2, unit: '%' },
    { name: 'Стоимость привлечения капитала', value: 7.2, industry: 8.5, unit: '%' },
    { name: 'Доля экспорта', value: 23.1, industry: 16.4, unit: '%' },
    { name: 'Инвестиции в R&D', value: 9.8, industry: 5.7, unit: '%' }
  ],
  brands: [
    'TechnoPro', 'CloudSynergy', 'DataFlow', 'AppWeaver', 'InnovateX'
  ],
  subsidiaries: [
    {
      id: 'sub1',
      name: 'ООО "ТехноПром-Инновации"',
      ownership: 100,
      children: [
        {
          id: 'sub1-1',
          name: 'ООО "ТехноПром-Лабс"',
          ownership: 80
        }
      ]
    },
    {
      id: 'sub2',
      name: 'ООО "Дата Центр Решения"',
      ownership: 75,
      children: [
        {
          id: 'sub2-1',
          name: 'ООО "Облачные Сервисы"',
          ownership: 100
        },
        {
          id: 'sub2-2',
          name: 'ООО "Дата Сторидж"',
          ownership: 60
        }
      ]
    },
    {
      id: 'sub3',
      name: 'ЗАО "ТехноПром-Восток"',
      ownership: 51
    }
  ],
  products: [
    'TechnoPro ERP - Система управления ресурсами предприятия',
    'CloudSynergy - Платформа для облачной синхронизации данных',
    'DataFlow CRM - Система управления взаимоотношениями с клиентами',
    'AppWeaver Mobile - Конструктор мобильных приложений',
    'InnovateX Analytics - Система бизнес-аналитики'
  ],
  management: [
    {
      name: 'Иванов Петр Алексеевич',
      position: 'Генеральный директор',
      since: '2015'
    },
    {
      name: 'Смирнова Елена Викторовна',
      position: 'Финансовый директор',
      since: '2016'
    },
    {
      name: 'Петров Александр Николаевич',
      position: 'Технический директор',
      since: '2018'
    },
    {
      name: 'Козлова Мария Игоревна',
      position: 'Директор по маркетингу',
      since: '2019'
    }
  ],
  owners: [
    {
      name: 'Иванов П.А.',
      share: 51
    },
    {
      name: 'ООО "ТехИнвест"',
      share: 30
    },
    {
      name: 'Петров А.Н.',
      share: 12
    },
    {
      name: 'Другие акционеры',
      share: 7
    }
  ],
  details: {
    inn: '7712345678',
    ogrn: '1027700123456',
    registrationDate: '15.03.2010',
    legalAddress: 'г. Москва, ул. Тверская, д. 1, офис 150',
    authorizedCapital: '10 000 000 ₽'
  }
};
