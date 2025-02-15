import { Card, CardContent } from "@/components/ui/card";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResultsChart from "@/components/calculators/ResultsChart";

const formSchema = z.object({
  principal: z.string().transform(Number).pipe(
    z.number()
      .positive("Investment amount must be positive")
      .max(1500000, "Maximum investment limit is ₹15,00,000")
  ),
  // Current SCSS rate is 8.2% p.a.
  years: z.string().transform(Number).pipe(
    z.number().min(5, "Fixed term of 5 years").max(5, "Fixed term of 5 years")
  ),
});

type FormValues = {
  principal: string;
  years: string;
};

const INTEREST_RATE = 8.2; // Current SCSS interest rate

export default function SCSSCalculator() {
  const [results, setResults] = useState<{
    quarterlyIncome: number;
    totalInterest: number;
    maturityAmount: number;
    yearlyData: Array<{ label: string; value: number }>;
  }>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: "100000",
      years: "5",
    },
  });

  function onSubmit(data: FormValues) {
    const principal = Number(data.principal);
    const years = Number(data.years);
    const quarterlyRate = INTEREST_RATE / 4 / 100;
    const totalQuarters = years * 4;

    const quarterlyIncome = principal * quarterlyRate;
    const totalInterest = quarterlyIncome * totalQuarters;
    const maturityAmount = principal;

    const yearlyData = Array.from({ length: years + 1 }, (_, i) => ({
      label: `Year ${i}`,
      value: Math.round(principal + (quarterlyIncome * i * 4)),
    }));

    setResults({
      quarterlyIncome,
      totalInterest,
      maturityAmount,
      yearlyData,
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Senior Citizen Savings Scheme Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate returns from Senior Citizen Savings Scheme (SCSS). The current interest rate is {INTEREST_RATE}% per annum,
        paid quarterly. Maximum investment limit is ₹15,00,000 per account.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="principal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Amount (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormDescription>
                        Amount you want to invest (Maximum: ₹15,00,000)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="years"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Period</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" value="5" disabled />
                      </FormControl>
                      <FormDescription>
                        SCSS has a fixed term of 5 years
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Calculate Returns
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 grid gap-4">
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Quarterly Interest Income
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.quarterlyIncome).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Paid every three months
                  </p>
                </div>

                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Total Interest Earned
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.totalInterest).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Over the 5-year period
                  </p>
                </div>

                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Maturity Amount
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.maturityAmount).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Original investment amount returned at maturity
                  </p>
                </div>
              </CardContent>
            </Card>

            <ResultsChart
              data={results.yearlyData}
              title="Cumulative Returns Over Time"
            />
          </div>
        )}
      </div>
    </div>
  );
}