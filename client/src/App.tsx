import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SchemeSelection from "@/pages/scheme-selection";
import FormFilling from "@/pages/form-filling";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/schemes" component={SchemeSelection} />
      <Route path="/form/:schemeId" component={FormFilling} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
