
import React, { useState, useRef, useEffect } from 'react';
import { Mic, SendHorizontal, Bot, User, X, Loader2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Здравствуйте! Я ваш AI-помощник по законодательному комплаенсу. Чем могу вам помочь?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognition = useRef<SpeechRecognition | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.lang = 'ru-RU';
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = false;
      
      speechRecognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      
      speechRecognition.current.onerror = () => {
        console.error('Speech recognition error');
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!isListening) {
      try {
        speechRecognition.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    } else {
      speechRecognition.current?.stop();
      setIsListening(false);
    }
  };
  
  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const mockAIResponse = (userMessage: string) => {
    setIsLoading(true);
    // Simulate AI thinking
    setTimeout(() => {
      let response = '';
      
      if (userMessage.toLowerCase().includes('риск') || userMessage.toLowerCase().includes('риски')) {
        response = 'Для минимизации рисков я рекомендую провести аудит всех бизнес-процессов и обновить внутреннюю документацию в соответствии с последними изменениями законодательства.';
      } else if (userMessage.toLowerCase().includes('закон') || userMessage.toLowerCase().includes('законодательств')) {
        response = 'В последний месяц произошло несколько важных изменений в законодательстве. Особое внимание стоит обратить на новые требования к защите персональных данных и обновления в налоговом кодексе.';
      } else if (userMessage.toLowerCase().includes('отчет') || userMessage.toLowerCase().includes('отчеты') || userMessage.toLowerCase().includes('отчётность')) {
        response = 'Для формирования качественной отчётности рекомендую использовать шаблоны из раздела "Документы" и обязательно учесть последние изменения в требованиях регуляторов.';
      } else if (userMessage.toLowerCase().includes('штраф') || userMessage.toLowerCase().includes('санкци')) {
        response = 'Чтобы избежать штрафов и санкций, нужно строго соблюдать сроки подачи отчётности и своевременно реагировать на изменения в законодательстве. Могу помочь составить календарь важных дат.';
      } else {
        response = 'Я могу помочь вам с анализом законодательных рисков, составлением отчётов и рекомендаций по устранению выявленных несоответствий. Что именно вас интересует?';
      }
      
      addMessage(response, 'ai');
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    
    addMessage(inputText, 'user');
    mockAIResponse(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Text-to-speech
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {!isOpen ? (
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
      ) : (
        <Card className="fixed bottom-6 right-6 w-[350px] md:w-[400px] shadow-lg z-50 border">
          <CardHeader className="p-4 flex flex-row items-center justify-between" style={{ backgroundColor: '#2DD4BF' }}>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <div className="w-6 h-6 overflow-hidden">
                <img 
                  src="/lovable-uploads/baced79b-ef78-45d4-ae84-b842ec73b605.png" 
                  alt="AI Assistant" 
                  className="h-full w-full"
                />
              </div>
              AI-Помощник
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[350px] px-4 py-2 border-y">
              <div className="space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={cn(
                      "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      message.sender === 'user' 
                        ? "ml-auto bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {message.sender === 'ai' ? (
                        <div className="w-4 h-4 overflow-hidden">
                          <img 
                            src="/lovable-uploads/baced79b-ef78-45d4-ae84-b842ec73b605.png" 
                            alt="AI Assistant" 
                            className="h-full w-full"
                          />
                        </div>
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.sender === 'ai' ? 'AI-помощник' : 'Вы'}
                      </span>
                      {message.sender === 'ai' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 ml-auto opacity-70 hover:opacity-100"
                          onClick={() => speakMessage(message.text)}
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p>{message.text}</p>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="p-4 flex gap-2 items-end">
              <Textarea 
                placeholder="Введите ваш вопрос..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-[60px] resize-none"
              />
              <div className="flex flex-col gap-2">
                <Button 
                  size="icon" 
                  onClick={toggleListening}
                  className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  onClick={handleSubmit}
                  style={{ backgroundColor: '#2DD4BF' }}
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;
