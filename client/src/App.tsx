import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SipCalculator from "@/pages/SipCalculator";
import LumpsumCalculator from "@/pages/LumpsumCalculator";
import HRACalculator from "@/pages/HRACalculator";
import RetirementCalculator from "@/pages/RetirementCalculator";
import HomeLoanCalculator from "@/pages/HomeLoanCalculator";
import CarLoanCalculator from "@/pages/CarLoanCalculator";
import CreditCardCalculator from "@/pages/CreditCardCalculator";
import InterestCalculator from "@/pages/InterestCalculator";
import PPFCalculator from "@/pages/PPFCalculator";
import FDCalculator from "@/pages/FDCalculator";
import RDCalculator from "@/pages/RDCalculator";
import SimpleInterestCalculator from "@/pages/SimpleInterestCalculator";
import NPSCalculator from "@/pages/NPSCalculator";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sip-calculator" component={SipCalculator} />
          <Route path="/lumpsum-calculator" component={LumpsumCalculator} />
          <Route path="/hra-calculator" component={HRACalculator} />
          <Route path="/retirement-calculator" component={RetirementCalculator} />
          <Route path="/home-loan-calculator" component={HomeLoanCalculator} />
          <Route path="/car-loan-calculator" component={CarLoanCalculator} />
          <Route path="/credit-card-calculator" component={CreditCardCalculator} />
          <Route path="/interest-calculator" component={InterestCalculator} />
          <Route path="/ppf-calculator" component={PPFCalculator} />
          <Route path="/fd-calculator" component={FDCalculator} />
          <Route path="/rd-calculator" component={RDCalculator} />
          <Route path="/simple-interest-calculator" component={SimpleInterestCalculator} />
          <Route path="/nps-calculator" component={NPSCalculator} />
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