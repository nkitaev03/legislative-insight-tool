
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, SendHorizontal, X, Lightbulb, History, BrainCog } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'risk' | 'compliance' | 'optimization';
  priority: 'low' | 'medium' | 'high';
}

export default function EnhancedAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { text: 'Здравствуйте! Я ваш личный ИИ-помощник с улучшенными возможностями. Задайте мне вопрос или обратитесь за рекомендацией.', isUser: false }
  ]);
  const { toast } = useToast();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Sample recommendations that would come from the backend in a real application
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Обновление в законодательстве',
      description: 'Новые требования к информационной безопасности вступают в силу через 30 дней. Рекомендуется провести аудит текущих политик.',
      type: 'compliance',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Возможная оптимизация процесса',
      description: 'В модуле аудита обнаружены повторяющиеся действия. Автоматизация может снизить затраты времени на 30%.',
      type: 'optimization',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Потенциальный риск',
      description: 'Выявлена несогласованность в документации по охране труда. Рекомендуется обновить внутренние регламенты.',
      type: 'risk',
      priority: 'high'
    }
  ]);

  const handleSubmit = () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, isUser: true };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = { 
        text: `Это хороший вопрос! На основе анализа данных, ${input.toLowerCase().includes('риск') ? 
          'я рекомендую обратить внимание на недавние изменения в законодательстве о персональных данных.' : 
          'я могу предложить оптимизировать процесс проверки соответствия, используя автоматические напоминания.'}`, 
        isUser: false 
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 500);
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate a proactive suggestion after 10 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const proactiveSuggestion = {
          text: 'Анализируя вашу активность, я заметил, что в разделе "Аудит" есть несколько задач с высоким приоритетом, которые скоро достигнут дедлайна. Хотите просмотреть эти задачи?',
          isUser: false
        };
        setMessages(prev => [...prev, proactiveSuggestion]);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <>
      {!isOpen ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setIsOpen(true)} 
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg p-0 overflow-hidden"
                style={{ backgroundColor: '#2DD4BF', border: 'none' }}
              >
                <img 
                  src="/lovable-uploads/baced79b-ef78-45d4-ae84-b842ec73b605.png" 
                  alt="AI Assistant" 
                  className="h-10 w-10"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Открыть ИИ-помощника</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Card className="fixed bottom-6 right-6 w-[350px] md:w-[400px] shadow-lg z-50 border rounded-xl overflow-hidden">
          <CardHeader className="p-4 flex flex-row items-center justify-between" style={{ backgroundColor: '#2DD4BF' }}>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <div className="w-6 h-6 overflow-hidden">
                <img 
                  src="/lovable-uploads/baced79b-ef78-45d4-ae84-b842ec73b605.png" 
                  alt="AI Assistant" 
                  className="h-full w-full"
                />
              </div>
              AI-Помощник Pro
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <BrainCog className="h-4 w-4" />
                Диалог
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-1">
                <Lightbulb className="h-4 w-4" />
                Рекомендации
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <History className="h-4 w-4" />
                История
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="p-0">
              <CardContent className="p-4 h-[300px] overflow-y-auto" ref={messageContainerRef}>
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`rounded-xl px-4 py-2 text-sm max-w-[80%] ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                          }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 gap-4">
                <div className="relative flex-1">
                  <Textarea
                    placeholder="Задайте вопрос или запросите совет..."
                    className="min-h-10 resize-none overflow-hidden rounded-xl pr-12"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
                          const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
                          const recognition = new SpeechRecognitionAPI();
                          recognition.continuous = false;
                          recognition.lang = 'ru-RU';
                          recognition.interimResults = false;
                          recognition.maxAlternatives = 1;

                          recognition.onstart = () => {
                            toast({
                              title: "Идет распознавание голоса...",
                              description: "Говорите четко и ясно.",
                            });
                          };

                          recognition.onresult = (event) => {
                            const transcript = event.results[0][0].transcript;
                            setInput(transcript);
                            toast({
                              title: "Голос распознан!",
                              description: `Текст: ${transcript}`,
                            });
                          };

                          recognition.onerror = (event) => {
                            console.error('Ошибка распознавания:', event.error);
                            toast({
                              title: "Ошибка распознавания голоса",
                              description: "Попробуйте еще раз.",
                              variant: "destructive",
                            });
                          };

                          recognition.onend = () => {
                            console.log('Распознавание завершено.');
                          };

                          recognition.start();
                        } else {
                          toast({
                            title: "Голосовой ввод не поддерживается",
                            description: "Ваш браузер не поддерживает распознавание голоса.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      onClick={handleSubmit}
                      style={{ backgroundColor: '#2DD4BF' }}
                      className="h-8 w-8 rounded-lg"
                    >
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="recommendations" className="p-0">
              <CardContent className="p-4 h-[340px] overflow-y-auto">
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <span className={`${getPriorityColor(rec.priority)} text-white text-xs px-2 py-0.5 rounded-full`}>
                          {rec.priority === 'high' ? 'Высокий' : rec.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      <div className="mt-2 flex justify-end">
                        <Button variant="outline" size="sm" className="text-xs">Подробнее</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="history" className="p-0">
              <CardContent className="p-4 h-[340px] overflow-y-auto">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    История взаимодействий и решенных задач будет отображаться здесь.
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Анализ риска соответствия</span>
                      <span className="text-xs text-muted-foreground">Вчера, 14:32</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Проведен анализ рисков в сфере персональных данных
                    </p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Проверка документации</span>
                      <span className="text-xs text-muted-foreground">21.03.2023, 09:15</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Проверены документы на соответствие требованиям
                    </p>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </>
  );
}
