import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StatusBar } from "@/components/layout/StatusBar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Dashboard } from "@/components/pages/Dashboard";
import { Calibration } from "@/components/pages/Calibration";
import { Login } from "@/components/pages/Login";
import { wsService } from "@/services/websocket";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize WebSocket connection
    wsService.connect();
    
    return () => {
      wsService.disconnect();
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <StatusBar />
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/calibration" element={<AppLayout><Calibration /></AppLayout>} />
          <Route path="/logs" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Logs & Downloads</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
          <Route path="/reports" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Flight Reports</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
          <Route path="/settings" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
          <Route path="/upload" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Firmware Upload</h1><p className="text-muted-foreground">Coming soon...</p></div></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
