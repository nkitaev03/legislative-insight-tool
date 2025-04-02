
import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Здравствуйте! Как я могу вам помочь сегодня?',
      sender: 'support',
      timestamp: new Date(),
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setMessage('');

    // Simulate response after a short delay
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Спасибо за ваш вопрос. Наш специалист скоро ответит вам.',
        sender: 'support',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-compGreen-500 hover:bg-compGreen-600 shadow-lg"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Открыть чат поддержки</span>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-border z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-medium">Чат поддержки</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Закрыть чат</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-h-96 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2",
              msg.sender === 'user' ? "flex-row-reverse" : ""
            )}
          >
            {msg.sender === 'support' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "rounded-lg p-3 max-w-[80%]",
                msg.sender === 'user'
                  ? "bg-compGreen-500 text-white"
                  : "bg-secondary text-foreground"
              )}
            >
              <p className="text-sm">{msg.content}</p>
              <div
                className={cn(
                  "text-xs mt-1",
                  msg.sender === 'user'
                    ? "text-white/70"
                    : "text-muted-foreground"
                )}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Введите ваш вопрос..."
            className="min-h-10 flex-1"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            className="h-10 w-10 p-0"
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Отправить</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
