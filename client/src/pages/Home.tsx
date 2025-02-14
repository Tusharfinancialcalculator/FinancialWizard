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
  BadgePercent, // Added for NPS icon
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
    title: "Lumpsum Calculator",
    description: "Calculate returns on one-time investments",
    icon: PiggyBank,
    href: "/lumpsum-calculator",
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
    title: "NPS Calculator", // Added new calculator
    description: "Calculate returns for National Pension Scheme",
    icon: BadgePercent,
    href: "/nps-calculator",
  },
  {
    title: "EMI Calculator",
    description: "Calculate loan EMIs and total interest",
    icon: Wallet,
    href: "/emi-calculator",
  },
  {
    title: "Credit Card Guide",
    description: "Learn about credit card usage and calculations",
    icon: CreditCard,
    href: "/credit-card-calculator",
  },
];

export default function Home() {
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

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}