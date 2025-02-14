import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SipCalculator from "@/pages/SipCalculator";
import LumpsumCalculator from "@/pages/LumpsumCalculator";
import EmiCalculator from "@/pages/EmiCalculator";
import CreditCardCalculator from "@/pages/CreditCardCalculator";
import InterestCalculator from "@/pages/InterestCalculator";
import PPFCalculator from "@/pages/PPFCalculator";
import FDCalculator from "@/pages/FDCalculator";
import RDCalculator from "@/pages/RDCalculator";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sip-calculator" component={SipCalculator} />
          <Route path="/lumpsum-calculator" component={LumpsumCalculator} />
          <Route path="/emi-calculator" component={EmiCalculator} />
          <Route path="/credit-card-calculator" component={CreditCardCalculator} />
          <Route path="/interest-calculator" component={InterestCalculator} />
          <Route path="/ppf-calculator" component={PPFCalculator} />
          <Route path="/fd-calculator" component={FDCalculator} />
          <Route path="/rd-calculator" component={RDCalculator} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;