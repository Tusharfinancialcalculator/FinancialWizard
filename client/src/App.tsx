import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./lib/theme-provider";
import Navbar from "@/components/layout/Navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SipCalculator from "@/pages/SipCalculator";
import StepUpSIPCalculator from "@/pages/StepUpSIPCalculator";
import LumpsumCalculator from "@/pages/LumpsumCalculator";
import HRACalculator from "@/pages/HRACalculator";
import RetirementCalculator from "@/pages/RetirementCalculator";
import HomeLoanCalculator from "@/pages/HomeLoanCalculator";
import CarLoanCalculator from "@/pages/CarLoanCalculator";
import CreditCardCalculator from "@/pages/CreditCardCalculator";
import PPFCalculator from "@/pages/PPFCalculator";
import FDCalculator from "@/pages/FDCalculator";
import RDCalculator from "@/pages/RDCalculator";
import SimpleInterestCalculator from "@/pages/SimpleInterestCalculator";
import CompoundInterestCalculator from "@/pages/CompoundInterestCalculator";
import NSCCalculator from "@/pages/NSCCalculator";
import IncomeTaxCalculator from "@/pages/IncomeTaxCalculator";
import NPSCalculator from "@/pages/NPSCalculator";
import CAGRCalculator from "@/pages/CAGRCalculator";
import GratuityCalculator from "@/pages/GratuityCalculator";
import APYCalculator from "@/pages/APYCalculator";
import GSTCalculator from "@/pages/GSTCalculator";
import FlatVsReducingCalculator from "@/pages/FlatVsReducingCalculator";
import BrokerageCalculator from "@/pages/BrokerageCalculator";
import MarginCalculator from "@/pages/MarginCalculator";
import TDSCalculator from "@/pages/TDSCalculator";
import SalaryCalculator from "@/pages/SalaryCalculator";
import InflationCalculator from "@/pages/InflationCalculator";
import PostOfficeMISCalculator from "@/pages/PostOfficeMISCalculator";
import SCSSCalculator from "@/pages/SCSSCalculator";
import StockAveragePriceCalculator from "@/pages/StockAveragePriceCalculator";

function Router() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sip-calculator" component={SipCalculator} />
          <Route path="/step-up-sip-calculator" component={StepUpSIPCalculator} />
          <Route path="/lumpsum-calculator" component={LumpsumCalculator} />
          <Route path="/hra-calculator" component={HRACalculator} />
          <Route path="/retirement-calculator" component={RetirementCalculator} />
          <Route path="/home-loan-calculator" component={HomeLoanCalculator} />
          <Route path="/car-loan-calculator" component={CarLoanCalculator} />
          <Route path="/credit-card-calculator" component={CreditCardCalculator} />
          <Route path="/ppf-calculator" component={PPFCalculator} />
          <Route path="/fd-calculator" component={FDCalculator} />
          <Route path="/rd-calculator" component={RDCalculator} />
          <Route path="/simple-interest-calculator" component={SimpleInterestCalculator} />
          <Route path="/compound-interest-calculator" component={CompoundInterestCalculator} />
          <Route path="/nsc-calculator" component={NSCCalculator} />
          <Route path="/income-tax-calculator" component={IncomeTaxCalculator} />
          <Route path="/nps-calculator" component={NPSCalculator} />
          <Route path="/cagr-calculator" component={CAGRCalculator} />
          <Route path="/gratuity-calculator" component={GratuityCalculator} />
          <Route path="/apy-calculator" component={APYCalculator} />
          <Route path="/gst-calculator" component={GSTCalculator} />
          <Route path="/flat-vs-reducing-calculator" component={FlatVsReducingCalculator} />
          <Route path="/brokerage-calculator" component={BrokerageCalculator} />
          <Route path="/margin-calculator" component={MarginCalculator} />
          <Route path="/tds-calculator" component={TDSCalculator} />
          <Route path="/salary-calculator" component={SalaryCalculator} />
          <Route path="/inflation-calculator" component={InflationCalculator} />
          <Route path="/post-office-mis-calculator" component={PostOfficeMISCalculator} />
          <Route path="/scss-calculator" component={SCSSCalculator} />
          <Route path="/stock-average-price-calculator" component={StockAveragePriceCalculator} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="calculator-theme">
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}