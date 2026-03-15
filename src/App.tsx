import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";

// Pages
import Welcome from "@/pages/onboarding/welcome";
import Auth from "@/pages/onboarding/auth";
import NameInput from "@/pages/onboarding/name";
import Message from "@/pages/onboarding/message";
import CircleSetup from "@/pages/onboarding/circle-setup";
import Home from "@/pages/main/home";
import Journey from "@/pages/main/journey";
import Circles from "@/pages/main/circles";
import CircleDetail from "@/pages/main/circle-detail";
import Health from "@/pages/main/health";
import Profile from "@/pages/main/profile";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return <Redirect to={isAuthenticated ? "/home" : "/welcome"} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      
      {/* Onboarding */}
      <Route path="/welcome" component={Welcome} />
      <Route path="/auth" component={Auth} />
      <Route path="/name" component={NameInput} />
      <Route path="/message" component={Message} />
      <Route path="/setup-circle" component={CircleSetup} />
      
      {/* Main App */}
      <Route path="/home" component={Home} />
      <Route path="/journey" component={Journey} />
      <Route path="/circles" component={Circles} />
      <Route path="/circles/:id" component={CircleDetail} />
      <Route path="/health" component={Health} />
      <Route path="/profile" component={Profile} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
