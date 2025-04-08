
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function About() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl font-bold">НОРМ - Платформа нормативного соответствия</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Комплексное решение для управления соответствием нормативным требованиям 
          и снижения регуляторных рисков
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">О платформе</h2>
                <p className="mb-4">
                  НОРМ – это интеллектуальная платформа, созданная для помощи бизнесу в соблюдении 
                  нормативных требований и законодательства. Наше решение помогает организациям 
                  своевременно реагировать на изменения в нормативной среде, оценивать риски 
                  и принимать обоснованные решения.
                </p>
                <p>
                  Платформа объединяет мониторинг законодательства, анализ рисков, 
                  проведение аудитов и моделирование сценариев в едином интерфейсе, 
                  предоставляя полную картину соответствия вашего бизнеса нормативным требованиям.
                </p>
              </div>
              <div className="md:w-1/3 flex items-center justify-center">
                <div className="h-48 w-48 bg-compPurple-100 rounded-full flex items-center justify-center">
                  <div className="h-36 w-36 bg-compPurple-200 rounded-full flex items-center justify-center">
                    <div className="h-24 w-24 bg-compPurple-500 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">НОРМ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">Основные функции</TabsTrigger>
            <TabsTrigger value="benefits">Преимущества</TabsTrigger>
            <TabsTrigger value="modules">Модули платформы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Ключевые возможности</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="mr-3 h-8 w-8 rounded-full bg-compGreen-500 flex items-center justify-center text-white">1</div>
                      <div>
                        <h4 className="font-medium">Мониторинг изменений законодательства</h4>
                        <p className="text-sm text-muted-foreground">Автоматический мониторинг изменений в нормативных требованиях и оповещение о важных обновлениях</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="mr-3 h-8 w-8 rounded-full bg-compGreen-500 flex items-center justify-center text-white">2</div>
                      <div>
                        <h4 className="font-medium">Оценка рисков</h4>
                        <p className="text-sm text-muted-foreground">Анализ регуляторных рисков и определение их потенциального влияния на бизнес</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="mr-3 h-8 w-8 rounded-full bg-compGreen-500 flex items-center justify-center text-white">3</div>
                      <div>
                        <h4 className="font-medium">Аудит соответствия</h4>
                        <p className="text-sm text-muted-foreground">Проведение комплексных аудитов соответствия с детальным анализом и рекомендациями</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="mr-3 h-8 w-8 rounded-full bg-compGreen-500 flex items-center justify-center text-white">4</div>
                      <div>
                        <h4 className="font-medium">Моделирование сценариев</h4>
                        <p className="text-sm text-muted-foreground">Создание и анализ различных сценариев для оценки потенциальных рисков и их последствий</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="mr-3 h-8 w-8 rounded-full bg-compGreen-500 flex items-center justify-center text-white">5</div>
                      <div>
                        <h4 className="font-medium">Управление задачами</h4>
                        <p className="text-sm text-muted-foreground">Распределение задач по обеспечению соответствия и контроль их выполнения</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="mr-3 h-8 w-8 rounded-full bg-compGreen-500 flex items-center justify-center text-white">6</div>
                      <div>
                        <h4 className="font-medium">ИИ-поддержка</h4>
                        <p className="text-sm text-muted-foreground">Интеллектуальный помощник для ответов на вопросы и предоставления рекомендаций</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="benefits" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Преимущества использования НОРМ</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-compPurple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-compPurple-700 mb-2">Снижение рисков</h4>
                    <p className="text-sm">Своевременное выявление и минимизация рисков несоответствия нормативным требованиям</p>
                  </div>
                  
                  <div className="bg-compGreen-50 p-4 rounded-lg">
                    <h4 className="font-medium text-compGreen-700 mb-2">Экономия времени</h4>
                    <p className="text-sm">Автоматизация процессов мониторинга и анализа позволяет сосредоточиться на стратегических задачах</p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-700 mb-2">Повышение эффективности</h4>
                    <p className="text-sm">Оптимизация процессов обеспечения соответствия и улучшение взаимодействия между отделами</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700 mb-2">Централизация данных</h4>
                    <p className="text-sm">Вся информация о соответствии и рисках собрана в одном месте для удобного доступа и анализа</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-medium text-indigo-700 mb-2">Интеллектуальный анализ</h4>
                    <p className="text-sm">Использование продвинутых алгоритмов и ИИ для глубокого анализа данных и формирования рекомендаций</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-700 mb-2">Избежание штрафов</h4>
                    <p className="text-sm">Своевременное реагирование на изменения в законодательстве помогает избежать штрафов и санкций</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="modules" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Модули платформы</h3>
                <div className="space-y-6">
                  <div className="border p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">Панель управления</h4>
                    <p className="mb-3">Главная панель управления с ключевыми показателями, оповещениями и основной информацией о состоянии соответствия.</p>
                    <div className="bg-gray-100 p-3 rounded">
                      <ul className="list-disc list-inside text-sm">
                        <li>Обзор текущего уровня соответствия</li>
                        <li>Ключевые показатели эффективности</li>
                        <li>Последние уведомления и оповещения</li>
                        <li>Карта бизнес-процессов с оценкой рисков</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">Мониторинг законодательства</h4>
                    <p className="mb-3">Модуль для отслеживания изменений в нормативно-правовой базе и релевантных для бизнеса новостей.</p>
                    <div className="bg-gray-100 p-3 rounded">
                      <ul className="list-disc list-inside text-sm">
                        <li>Отслеживание изменений в законодательстве</li>
                        <li>Фильтрация по отраслям и темам</li>
                        <li>Уведомления о важных изменениях</li>
                        <li>Анализ влияния изменений на бизнес</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">Моделирование рисков</h4>
                    <p className="mb-3">Модуль для создания и анализа различных сценариев с учетом регуляторных рисков.</p>
                    <div className="bg-gray-100 p-3 rounded">
                      <ul className="list-disc list-inside text-sm">
                        <li>Монте-Карло симуляция рисков</li>
                        <li>Визуализация результатов моделирования</li>
                        <li>Оценка последствий различных сценариев</li>
                        <li>Тепловая карта рисков</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">Аудит соответствия</h4>
                    <p className="mb-3">Модуль для проведения внутренних аудитов соответствия и управления выявленными рисками.</p>
                    <div className="bg-gray-100 p-3 rounded">
                      <ul className="list-disc list-inside text-sm">
                        <li>Детальный анализ соответствия по областям</li>
                        <li>Выявление и классификация рисков</li>
                        <li>Рекомендации по устранению несоответствий</li>
                        <li>Отслеживание выполнения мероприятий</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
