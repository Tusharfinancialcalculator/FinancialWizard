import { Card, CardContent } from "@/components/ui/card";
import {
  Calculator,
  CreditCard,
  Wallet,
  PiggyBank,
  Landmark,
  Building2,
  Coins,
  Percent,
  BadgePercent,
  HomeIcon,
  Car,
  Building,
  Clock,
  Calculator as CalcIcon,
  PercentCircle,
  TrendingUp,
  Receipt,
  Banknote,
  LineChart,
  GraduationCap,
  DollarSign,
  BarChart2,
  TrendingDown,
  Scale,
  FileText,
  ChevronsUp,
  BarChart4,
  Inbox,
  Users,
  TrendingUp as ChartUp,
} from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    title: "SIP Calculator",
    description: "Calculate returns on systematic investment plans",
    icon: Calculator,
    href: "/sip-calculator",
  },
  {
    title: "Step-Up SIP Calculator",
    description: "Calculate SIP returns with annual investment increase",
    icon: TrendingUp,
    href: "/step-up-sip-calculator",
  },
  {
    title: "CAGR Calculator",
    description: "Find the compound annual growth rate of investments",
    icon: LineChart,
    href: "/cagr-calculator",
  },
  {
    title: "Lumpsum Calculator",
    description: "Calculate returns on one-time investments",
    icon: PiggyBank,
    href: "/lumpsum-calculator",
  },
  {
    title: "Gratuity Calculator",
    description: "Determine gratuity payouts upon retirement",
    icon: Banknote,
    href: "/gratuity-calculator",
  },
  {
    title: "APY Calculator",
    description: "Calculate monthly investments under Atal Pension Yojana",
    icon: GraduationCap,
    href: "/apy-calculator",
  },
  {
    title: "GST Calculator",
    description: "Compute payable GST amounts",
    icon: DollarSign,
    href: "/gst-calculator",
  },
  {
    title: "Flat vs Reducing Rate",
    description: "Compare EMIs under different interest schemes",
    icon: TrendingDown,
    href: "/flat-vs-reducing-calculator",
  },
  {
    title: "Brokerage Calculator",
    description: "Estimate brokerage charges for stock orders",
    icon: BarChart2,
    href: "/brokerage-calculator",
  },
  {
    title: "Margin Calculator",
    description: "Compute margin requirements for trading",
    icon: Scale,
    href: "/margin-calculator",
  },
  {
    title: "TDS Calculator",
    description: "Calculate tax deducted at source (TDS)",
    icon: FileText,
    href: "/tds-calculator",
  },
  {
    title: "Compound Interest",
    description: "Calculate compound interest with flexible compounding periods",
    icon: PercentCircle,
    href: "/compound-interest-calculator",
  },
  {
    title: "NSC Calculator",
    description: "Calculate returns on National Savings Certificate investments",
    icon: CalcIcon,
    href: "/nsc-calculator",
  },
  {
    title: "PPF Calculator",
    description: "Calculate returns on Public Provident Fund investments",
    icon: Landmark,
    href: "/ppf-calculator",
  },
  {
    title: "FD Calculator",
    description: "Calculate returns on fixed deposits",
    icon: Building2,
    href: "/fd-calculator",
  },
  {
    title: "RD Calculator",
    description: "Calculate returns on recurring deposits",
    icon: Coins,
    href: "/rd-calculator",
  },
  {
    title: "Simple Interest Calculator",
    description: "Calculate interest on loans and savings",
    icon: Percent,
    href: "/simple-interest-calculator",
  },
  {
    title: "Income Tax Calculator",
    description: "Calculate your income tax liability",
    icon: Receipt,
    href: "/income-tax-calculator",
  },
  {
    title: "NPS Calculator",
    description: "Calculate returns for National Pension Scheme",
    icon: BadgePercent,
    href: "/nps-calculator",
  },
  {
    title: "HRA Calculator",
    description: "Calculate House Rent Allowance exemptions",
    icon: Building,
    href: "/hra-calculator",
  },
  {
    title: "Retirement Calculator",
    description: "Plan for retirement with our comprehensive calculator",
    icon: Clock,
    href: "/retirement-calculator",
  },
  {
    title: "Home Loan EMI",
    description: "Calculate home loan EMIs and total interest",
    icon: HomeIcon,
    href: "/home-loan-calculator",
  },
  {
    title: "Car Loan EMI",
    description: "Calculate car loan EMIs and total interest",
    icon: Car,
    href: "/car-loan-calculator",
  },
  {
    title: "Credit Card Guide",
    description: "Learn about credit card usage and calculations",
    icon: CreditCard,
    href: "/credit-card-calculator",
  },
  {
    title: "Salary Calculator",
    description: "Calculate take-home salary after deductions",
    icon: Users,
    href: "/salary-calculator",
  },
  {
    title: "Inflation Calculator",
    description: "Analyze the impact of inflation on purchasing power",
    icon: ChartUp,
    href: "/inflation-calculator",
  },
  {
    title: "Post Office MIS",
    description: "Calculate Post Office Monthly Income Scheme returns",
    icon: Inbox,
    href: "/post-office-mis-calculator",
  },
  {
    title: "SCSS Calculator",
    description: "Calculate Senior Citizen Savings Scheme returns",
    icon: ChevronsUp,
    href: "/scss-calculator",
  },
  {
    title: "Stock Average Price",
    description: "Calculate average stock price across multiple purchases",
    icon: BarChart4,
    href: "/stock-average-price-calculator",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Financial Calculator Suite
        </h1>
        <p className="text-lg text-muted-foreground">
          Make informed financial decisions with our comprehensive calculator tools
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col">
                <feature.icon className="h-12 w-12 text-primary mb-4 shrink-0" />
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">{feature.title}</h2>
                <p className="text-muted-foreground text-sm line-clamp-2">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}