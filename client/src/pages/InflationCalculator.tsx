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
import { Card, CardContent } from "@/components/ui/card";
import ResultsChart from "@/components/calculators/ResultsChart";

const formSchema = z.object({
  amount: z.string().transform(Number).pipe(
    z.number().positive("Amount must be positive")
  ),
  years: z.string().transform(Number).pipe(
    z.number().positive("Years must be positive")
  ),
  inflationRate: z.string().transform(Number).pipe(
    z.number().min(0, "Inflation rate cannot be negative")
  ),
});

type FormValues = {
  amount: string;
  years: string;
  inflationRate: string;
};

export default function InflationCalculator() {
  const [results, setResults] = useState<{
    futureValue: number;
    valueReduction: number;
    yearlyData: Array<{ label: string; value: number }>;
  }>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "100000",
      years: "10",
      inflationRate: "6",
    },
  });

  function onSubmit(data: FormValues) {
    const amount = Number(data.amount);
    const years = Number(data.years);
    const rate = Number(data.inflationRate) / 100;

    const futureValue = amount / Math.pow(1 + rate, years);
    const valueReduction = amount - futureValue;

    const yearlyData = Array.from({ length: years + 1 }, (_, i) => ({
      label: `Year ${i}`,
      value: Math.round(amount / Math.pow(1 + rate, i)),
    }));

    setResults({
      futureValue,
      valueReduction,
      yearlyData,
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inflation Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate how inflation affects the purchasing power of your money over time.
        See how much your money will be worth in the future based on expected inflation rates.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormDescription>
                        The current value of money you want to analyze
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
                      <FormLabel>Number of Years</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormDescription>
                        How many years into the future you want to calculate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inflationRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inflation Rate (%)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.1" />
                      </FormControl>
                      <FormDescription>
                        Expected annual inflation rate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Calculate Impact
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
                    Today's Value
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Number(form.getValues("amount")).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Future Purchasing Power
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.futureValue).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Loss in Purchasing Power
                  </h3>
                  <p className="text-2xl font-semibold text-destructive">
                    ₹{Math.round(results.valueReduction).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <ResultsChart
              data={results.yearlyData}
              title="Purchasing Power Over Time"
            />
          </div>
        )}
      </div>
    </div>
  );
}