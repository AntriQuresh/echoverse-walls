import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Premium from "./pages/Premium";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import Upload from "./pages/Upload";
import ProfileSubmission from "./pages/ProfileSubmission";
import AdminDashboard from "./pages/AdminDashboard";
import WallpaperPreview from "./pages/WallpaperPreview";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => {
  // Get the base path from Vite configuration
  const basename = import.meta.env.BASE_URL;
  
  console.log('App starting with basename:', basename);
  console.log('Environment:', import.meta.env.MODE);
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={basename}>
            <div className="min-h-screen cosmic-bg">
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/profile-submission" element={<ProfileSubmission />} />
                <Route path="/wallpaper/:id" element={<WallpaperPreview />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
