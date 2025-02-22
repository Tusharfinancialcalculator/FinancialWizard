import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Calculator } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Investment", items: [
    { name: "SIP Calculator", href: "/sip-calculator" },
    { name: "Step-Up SIP Calculator", href: "/step-up-sip-calculator" },
    { name: "Lumpsum Calculator", href: "/lumpsum-calculator" },
    { name: "CAGR Calculator", href: "/cagr-calculator" },
    { name: "PPF Calculator", href: "/ppf-calculator" },
    { name: "NSC Calculator", href: "/nsc-calculator" },
    { name: "FD Calculator", href: "/fd-calculator" },
    { name: "RD Calculator", href: "/rd-calculator" },
    { name: "NPS Calculator", href: "/nps-calculator" },
    { name: "APY Calculator", href: "/apy-calculator" },
    { name: "SCSS Calculator", href: "/scss-calculator" },
    { name: "Post Office MIS", href: "/post-office-mis-calculator" },
    { name: "Stock Average Price", href: "/stock-average-price-calculator" },
    { name: "Brokerage Calculator", href: "/brokerage-calculator" },
    { name: "Margin Calculator", href: "/margin-calculator" },
  ]},
  { name: "Interest", items: [
    { name: "Simple Interest", href: "/simple-interest-calculator" },
    { name: "Compound Interest", href: "/compound-interest-calculator" },
    { name: "Flat vs Reducing Rate", href: "/flat-vs-reducing-calculator" },
  ]},
  { name: "Loans", items: [
    { name: "Home Loan EMI", href: "/home-loan-calculator" },
    { name: "Car Loan EMI", href: "/car-loan-calculator" },
  ]},
  { name: "Tax & Salary", items: [
    { name: "Income Tax", href: "/income-tax-calculator" },
    { name: "TDS Calculator", href: "/tds-calculator" },
    { name: "GST Calculator", href: "/gst-calculator" },
    { name: "HRA Calculator", href: "/hra-calculator" },
    { name: "Gratuity Calculator", href: "/gratuity-calculator" },
    { name: "Salary Calculator", href: "/salary-calculator" },
  ]},
  { name: "Planning", items: [
    { name: "Retirement", href: "/retirement-calculator", description: "Calculate required retirement corpus and monthly savings needed, considering inflation and returns" },
    { name: "Credit Card", href: "/credit-card-calculator" },
    { name: "Inflation", href: "/inflation-calculator" },
  ]},
];

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-primary" />
            <Link href="/">
              <span className="ml-2 text-xl font-bold text-primary cursor-pointer">
                Financial Calculator
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              item.items ? (
                <div key={item.name} className="relative group">
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted">
                    {item.name}
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-background ring-1 ring-black ring-opacity-5 hidden group-hover:block z-50">
                    <div className="py-1" role="menu">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={cn(
                            "block px-4 py-2 text-sm",
                            location === subItem.href
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {item.name}
                </Link>
              )
            ))}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}