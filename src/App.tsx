
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./hooks/use-theme";
import AIAssistant from "./components/common/AIAssistant";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" closeButton={true} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/monitoring" element={<Index />} />
            <Route path="/simulation" element={<Index />} />
            <Route path="/audit" element={<Index />} />
            <Route path="/profile" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIAssistant />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
