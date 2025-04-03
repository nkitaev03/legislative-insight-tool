
import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';

interface VoiceSearchProps {
  onSearch?: (query: string) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const speechRecognition = useRef<SpeechRecognition | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut to open search (Ctrl+/)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

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
        setSearchQuery(transcript);
        // Focus the search input
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
        setIsListening(false);
      };
      
      speechRecognition.current.onerror = () => {
        console.error('Speech recognition error');
        setIsListening(false);
      };
      
      // Check for microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setHasPermission(true);
        })
        .catch(() => {
          setHasPermission(false);
        });
    }
  }, []);

  const toggleListening = () => {
    if (!speechRecognition.current) {
      console.error('Speech recognition not supported');
      return;
    }
    
    if (!isListening) {
      try {
        speechRecognition.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    } else {
      speechRecognition.current.stop();
      setIsListening(false);
    }
  };

  // Example search results
  const searchResults = [
    { id: 1, title: 'Изменения в законе о персональных данных', category: 'Законодательство' },
    { id: 2, title: 'Политика конфиденциальности', category: 'Документы' },
    { id: 3, title: 'Аудит ИТ-безопасности', category: 'Задачи' },
    { id: 4, title: 'Отчет о соответствии GDPR', category: 'Отчеты' },
    { id: 5, title: 'Обновление правил внутреннего трудового распорядка', category: 'Задачи' },
  ];

  // Filter results based on search query
  const filteredResults = searchResults.filter(result => 
    result.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleResultClick = (result: { id: number, title: string }) => {
    console.log('Selected result:', result);
    if (onSearch) {
      onSearch(result.title);
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Поиск...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput 
            ref={inputRef}
            placeholder="Что вы ищете?" 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <div className="flex gap-2 ml-2">
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            {hasPermission !== false && (
              <Button
                variant={isListening ? "destructive" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={toggleListening}
              >
                <Mic className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
        <CommandList>
          {searchQuery && filteredResults.length === 0 && (
            <CommandEmpty>Результатов не найдено</CommandEmpty>
          )}
          
          {searchQuery && filteredResults.length > 0 && (
            <>
              <CommandGroup heading="Результаты поиска">
                {filteredResults.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleResultClick(result)}
                  >
                    <div>
                      <p>{result.title}</p>
                      <p className="text-xs text-muted-foreground">{result.category}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          
          {!searchQuery && (
            <>
              <CommandGroup heading="Рекомендуемые">
                <CommandItem onSelect={() => handleResultClick({ id: 1, title: 'Изменения в законе о персональных данных' })}>
                  Изменения в законе о персональных данных
                </CommandItem>
                <CommandItem onSelect={() => handleResultClick({ id: 2, title: 'Новые уведомления' })}>
                  Новые уведомления
                </CommandItem>
                <CommandItem onSelect={() => handleResultClick({ id: 3, title: 'Задачи на сегодня' })}>
                  Задачи на сегодня
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Категории">
                <CommandItem>Законодательство</CommandItem>
                <CommandItem>Документы</CommandItem>
                <CommandItem>Задачи</CommandItem>
                <CommandItem>Отчеты</CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default VoiceSearch;
