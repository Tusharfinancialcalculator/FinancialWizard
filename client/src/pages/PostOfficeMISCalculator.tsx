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
      .max(900000, "Maximum investment limit is ₹9,00,000")
  ),
  // Current POMIS rate is 7.1% p.a.
  years: z.string().transform(Number).pipe(
    z.number().min(1, "Minimum term is 1 year").max(5, "Maximum term is 5 years")
  ),
});

type FormValues = {
  principal: string;
  years: string;
};

const INTEREST_RATE = 7.1; // Current Post Office MIS interest rate

export default function PostOfficeMISCalculator() {
  const [results, setResults] = useState<{
    monthlyIncome: number;
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
    const monthlyRate = INTEREST_RATE / 12 / 100;
    const totalMonths = years * 12;

    const monthlyIncome = principal * monthlyRate;
    const totalInterest = monthlyIncome * totalMonths;
    const maturityAmount = principal;

    const yearlyData = Array.from({ length: years + 1 }, (_, i) => ({
      label: `Year ${i}`,
      value: Math.round(principal + (monthlyIncome * i * 12)),
    }));

    setResults({
      monthlyIncome,
      totalInterest,
      maturityAmount,
      yearlyData,
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Post Office Monthly Income Scheme Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate your monthly income from Post Office MIS investment. The current interest rate is {INTEREST_RATE}% per annum,
        paid monthly. Maximum investment limit is ₹9,00,000 per account.
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
                        Amount you want to invest (Maximum: ₹9,00,000)
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
                      <FormLabel>Investment Period (Years)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" max="5" />
                      </FormControl>
                      <FormDescription>
                        Investment term (1-5 years)
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
                    Monthly Income
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.monthlyIncome).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Total Interest Earned
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.totalInterest).toLocaleString()}
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