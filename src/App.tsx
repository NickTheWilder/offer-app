import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AdminPage from "@/pages/admin-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => <ProtectedRoute path="/" component={HomePage} />}
      </Route>
      <Route path="/admin">
        {() => <ProtectedRoute path="/admin" component={AdminPage} />}
      </Route>
      <Route path="/auth">
        {() => <AuthPage />}
      </Route>
      <Route>
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
