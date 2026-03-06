import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Onboarding
import CoachOnboarding from "./pages/onboarding/CoachOnboarding";
import AthleteOnboarding from "./pages/onboarding/AthleteOnboarding";
import RoleRecovery from "./pages/onboarding/RoleRecovery";

// Layouts
import CoachLayout from "./layouts/CoachLayout";
import AthleteLayout from "./layouts/AthleteLayout";

// Coach pages
import CoachDashboard from "./pages/coach/CoachDashboard";
import SessionBuilder from "./pages/coach/SessionBuilder";
import Roster from "./pages/coach/Roster";
import CoachCalendar from "./pages/coach/CoachCalendar";
import Analytics from "./pages/coach/Analytics";

// Athlete pages
import AthleteToday from "./pages/athlete/AthleteToday";
import MorningCheckin from "./pages/athlete/MorningCheckin";
import PostSessionCheckin from "./pages/athlete/PostSessionCheckin";
import EveningCheckin from "./pages/athlete/EveningCheckin";
import WellnessHistory from "./pages/athlete/WellnessHistory";
import AthleteCalendar from "./pages/athlete/AthleteCalendar";
import AthleteProfile from "./pages/athlete/AthleteProfile";
import FlagInjury from "./pages/athlete/FlagInjury";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'coach' | 'athlete' }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading…</p></div>;
  if (!user) return <Navigate to="/landing" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function HomeRedirect() {
  const { user, role, loading, profile } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading…</p></div>;
  if (!user) return <Navigate to="/landing" replace />;
  if (role === 'coach') {
    if (!profile?.team_id) return <Navigate to="/onboarding/coach" replace />;
    return <Navigate to="/coach/dashboard" replace />;
  }
  if (role === 'athlete') return <Navigate to="/athlete/today" replace />;
  return <Navigate to="/onboarding/role" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Onboarding */}
            <Route path="/onboarding/coach" element={<ProtectedRoute requiredRole="coach"><CoachOnboarding /></ProtectedRoute>} />
            <Route path="/onboarding/athlete" element={<ProtectedRoute requiredRole="athlete"><AthleteOnboarding /></ProtectedRoute>} />
            <Route path="/onboarding/role" element={<ProtectedRoute><RoleRecovery /></ProtectedRoute>} />

            {/* Coach */}
            <Route path="/coach" element={<ProtectedRoute requiredRole="coach"><CoachLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<CoachDashboard />} />
              <Route path="sessions" element={<SessionBuilder />} />
              <Route path="roster" element={<Roster />} />
              <Route path="calendar" element={<CoachCalendar />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>

            {/* Athlete */}
            <Route path="/athlete" element={<ProtectedRoute requiredRole="athlete"><AthleteLayout /></ProtectedRoute>}>
              <Route path="today" element={<AthleteToday />} />
              <Route path="checkin/morning" element={<MorningCheckin />} />
              <Route path="checkin/post/:sessionId?" element={<PostSessionCheckin />} />
              <Route path="checkin/evening" element={<EveningCheckin />} />
              <Route path="wellness" element={<WellnessHistory />} />
              <Route path="calendar" element={<AthleteCalendar />} />
              <Route path="profile" element={<AthleteProfile />} />
              <Route path="injury" element={<FlagInjury />} />
            </Route>

            {/* Home redirect */}
            <Route path="/" element={<HomeRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
