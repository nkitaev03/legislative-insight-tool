
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import EventsPage from "./pages/EventsPage";
import RisksPage from "./pages/RisksPage";
import MeasuresPage from "./pages/MeasuresPage";
import { ThemeProvider } from "./hooks/use-theme";
import EnhancedAIAssistant from "./components/common/EnhancedAIAssistant";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex w-full">
    <Sidebar />
    <div className="flex-1 ml-64">
      <Header sidebarCollapsed={false} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  </div>
);

const App = () => (
  <ThemeProvider defaultTheme="system">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" closeButton={true} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<AppLayout><EventsPage /></AppLayout>} />
            <Route path="/risks" element={<AppLayout><RisksPage /></AppLayout>} />
            <Route path="/measures" element={<AppLayout><MeasuresPage /></AppLayout>} />
            <Route path="/monitoring" element={<Index />} />
            <Route path="/simulation" element={<Index />} />
            <Route path="/audit" element={<Index />} />
            <Route path="/profile" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <EnhancedAIAssistant />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
