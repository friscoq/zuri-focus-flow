import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NudgeProvider } from "@/contexts/NudgeContext";
import { FocusProvider } from "@/contexts/FocusContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/components/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NudgeProvider>
      <FocusProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </FocusProvider>
    </NudgeProvider>
  </QueryClientProvider>
);

export default App;
