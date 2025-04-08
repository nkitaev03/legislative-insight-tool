
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import { ThemeProvider } from "./hooks/use-theme";
import EnhancedAIAssistant from "./components/common/EnhancedAIAssistant";
import { useEffect, useState } from "react";
import GuidedTour from "./components/common/GuidedTour";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [showAppTour, setShowAppTour] = useState(false);
  
  useEffect(() => {
    // Check if this is the user's first visit
    const isFirstVisit = !localStorage.getItem('app-tour-completed');
    
    if (isFirstVisit) {
      // Delay the tour to ensure the UI is fully loaded
      const timer = setTimeout(() => {
        setShowAppTour(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const appTourSteps = [
    {
      target: '[data-app-tour="sidebar"]',
      title: 'Навигация',
      content: 'Используйте боковое меню для перехода между разделами приложения.',
      position: 'right' as const,
    },
    {
      target: '[data-app-tour="dashboard"]',
      title: 'Дашборд',
      content: 'На дашборде отображаются ключевые показатели и уведомления. Вы можете настроить его под свои потребности.',
      position: 'bottom' as const,
    },
    {
      target: '[data-app-tour="profile"]',
      title: 'Профиль',
      content: 'Здесь вы можете настроить визуальные параметры и предпочтения для персонализации системы.',
      position: 'bottom' as const,
    }
  ];

  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" closeButton={true} />
          <BrowserRouter>
            {showAppTour && (
              <GuidedTour 
                steps={appTourSteps} 
                onComplete={() => {
                  localStorage.setItem('app-tour-completed', 'true');
                }} 
              />
            )}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/monitoring" element={<Index />} />
              <Route path="/simulation" element={<Index />} />
              <Route path="/audit" element={<Index />} />
              <Route path="/profile" element={<Index />} />
              <Route path="/dashboard/settings" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <EnhancedAIAssistant />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
