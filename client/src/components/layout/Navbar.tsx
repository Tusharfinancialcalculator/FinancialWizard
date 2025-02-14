import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Calculator } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "SIP Calculator", href: "/sip-calculator" },
  { name: "Lumpsum Calculator", href: "/lumpsum-calculator" },
  { name: "EMI Calculator", href: "/emi-calculator" },
  { name: "Credit Card", href: "/credit-card-calculator" },
  { name: "Interest", href: "/interest-calculator" },
  { name: "PPF Calculator", href: "/ppf-calculator" },
  { name: "FD Calculator", href: "/fd-calculator" },
  { name: "RD Calculator", href: "/rd-calculator" },
  { name: "Simple Interest", href: "/simple-interest-calculator" },
  { name: "NPS Calculator", href: "/nps-calculator" },
];

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-primary">
              Financial Calculator
            </span>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}