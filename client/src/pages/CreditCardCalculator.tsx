import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, ShieldCheck, AlertTriangle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const formSchema = z.object({
  balance: z.coerce
    .number()
    .positive("Balance must be positive"),
  apr: z.coerce
    .number()
    .positive("APR must be positive"),
  minimumPayment: z.coerce
    .number()
    .positive("Minimum payment must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

const creditCardTips = [
  {
    title: "Pay More Than Minimum",
    content: "Always try to pay more than the minimum payment to reduce interest charges and pay off your balance faster.",
    icon: ShieldCheck,
  },
  {
    title: "Understand Your APR",
    content: "Annual Percentage Rate (APR) is the yearly interest rate. Monthly rate is APR divided by 12.",
    icon: AlertTriangle,
  },
  {
    title: "Grace Period",
    content: "Make full payments within the grace period (usually 21-25 days) to avoid interest charges on purchases.",
    icon: CreditCard,
  },
];

export default function CreditCardCalculator() {
  const [results, setResults] = useState<{
    monthsToPayOff: number;
    totalInterest: number;
    totalPayment: number;
    minimumPaymentWarning: boolean;
  }>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      balance: 10000,
      apr: 18,
      minimumPayment: 500,
    },
  });

  function calculatePayoff(balance: number, apr: number, monthlyPayment: number) {
    const monthlyRate = apr / 12 / 100;
    let remainingBalance = balance;
    let months = 0;
    let totalInterest = 0;

    while (remainingBalance > 0 && months < 1200) {
      const interest = remainingBalance * monthlyRate;
      totalInterest += interest;
      remainingBalance = remainingBalance + interest - monthlyPayment;
      months++;
    }

    return {
      monthsToPayOff: months,
      totalInterest: totalInterest,
      totalPayment: balance + totalInterest,
      minimumPaymentWarning: monthlyPayment < balance * 0.03,
    };
  }

  function onSubmit(data: FormValues) {
    const result = calculatePayoff(data.balance, data.apr, data.minimumPayment);
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Credit Card Calculator</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credit Card Balance (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Percentage Rate (APR %)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minimumPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Payment (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Calculate
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {results && (
            <Card className="bg-primary/5">
              <CardContent className="p-6 grid gap-4">
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Time to Pay Off
                  </h3>
                  <p className="text-2xl font-semibold">
                    {results.monthsToPayOff < 1200
                      ? `${Math.ceil(results.monthsToPayOff)} months`
                      : "Over 100 years"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Total Interest
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.totalInterest).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Total Payment
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.totalPayment).toLocaleString()}
                  </p>
                </div>
                {results.minimumPaymentWarning && (
                  <div className="bg-destructive/10 p-4 rounded-lg mt-2">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      <p className="font-medium">Warning</p>
                    </div>
                    <p className="text-sm mt-1">
                      Your monthly payment might be too low. Consider increasing it
                      to at least 3% of your balance to pay off your debt faster.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Credit Card Tips</h2>
              <div className="grid gap-4">
                {creditCardTips.map((tip) => (
                  <div
                    key={tip.title}
                    className="flex gap-3 p-4 rounded-lg bg-primary/5"
                  >
                    <tip.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tip.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Common Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    What is Credit Card APR?
                  </AccordionTrigger>
                  <AccordionContent>
                    APR (Annual Percentage Rate) is the yearly interest rate charged
                    on carried balances. A 24% APR means you'll pay approximately
                    2% monthly interest on unpaid balances.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How is minimum payment calculated?
                  </AccordionTrigger>
                  <AccordionContent>
                    Minimum payment is typically 2-4% of the balance or a fixed
                    amount (whichever is greater). Paying only the minimum extends
                    your debt and increases interest costs.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How can I avoid credit card debt?
                  </AccordionTrigger>
                  <AccordionContent>
                    Pay your full balance each month, don't spend more than you can
                    afford, keep track of your spending, and create a budget to
                    manage your expenses.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}