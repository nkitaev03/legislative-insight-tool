
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, SendHorizontal, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Здравствуйте! Я ваш личный ИИ-помощник. Задайте мне вопрос, и я постараюсь помочь.', isUser: false }
  ]);
  const { toast } = useToast();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, isUser: true };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = { text: `Это хороший вопрос! Я думаю, что ${input}.`, isUser: false };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 500);
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
              AI-Помощник
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-4 h-[300px] overflow-y-auto" ref={messageContainerRef}>
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`rounded-xl px-4 py-2 text-sm max-w-[70%] ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
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
                placeholder="Задайте вопрос..."
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
        </Card>
      )}
    </>
  );
}
