import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Calculator } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Investment", items: [
    { name: "SIP Calculator", href: "/sip-calculator" },
    { name: "Lumpsum Calculator", href: "/lumpsum-calculator" },
    { name: "PPF Calculator", href: "/ppf-calculator" },
    { name: "FD Calculator", href: "/fd-calculator" },
    { name: "RD Calculator", href: "/rd-calculator" },
    { name: "NPS Calculator", href: "/nps-calculator" },
  ]},
  { name: "Loans", items: [
    { name: "Home Loan EMI", href: "/home-loan-calculator" },
    { name: "Car Loan EMI", href: "/car-loan-calculator" },
  ]},
  { name: "Tax & Salary", items: [
    { name: "HRA Calculator", href: "/hra-calculator" },
    { name: "Simple Interest", href: "/simple-interest-calculator" },
  ]},
  { name: "Planning", items: [
    { name: "Retirement", href: "/retirement-calculator" },
    { name: "Credit Card", href: "/credit-card-calculator" },
  ]},
];

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm">
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

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navigation.map((item) => (
                item.items ? (
                  <div key={item.name} className="relative group">
                    <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                      {item.name}
                    </button>
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                      <div className="py-1" role="menu">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "block px-4 py-2 text-sm",
                              location === subItem.href
                                ? "bg-primary text-primary-foreground"
                                : "text-gray-700 hover:bg-gray-100"
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
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}