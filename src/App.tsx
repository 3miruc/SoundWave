
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Charts from "./pages/Charts";
import NowPlaying from "./pages/NowPlaying";
import Countries from "./pages/Countries";
import CountryTrends from "./pages/CountryTrends";
import NotFound from "./pages/NotFound";
import History from "./pages/History";
import Playlists from "./pages/Playlists";

const queryClient = new QueryClient();

const App = () => {
  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // If no theme is saved, or the saved theme is dark, apply dark mode
    if (!savedTheme || savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="bottom-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/now-playing" element={<NowPlaying />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/countries/:countryCode" element={<CountryTrends />} />
            <Route path="/history" element={<History />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
