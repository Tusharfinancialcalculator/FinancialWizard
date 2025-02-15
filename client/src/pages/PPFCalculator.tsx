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
import ResultsChart from "@/components/calculators/ResultsChart";
import { calculatePPF } from "@/lib/calculators";

const formSchema = z.object({
  yearlyInvestment: z.coerce
    .number()
    .positive("Investment amount must be positive"),
  years: z.coerce
    .number()
    .min(15, "PPF has a minimum lock-in period of 15 years")
    .max(50, "Maximum investment period is 50 years"),
});

type FormValues = z.infer<typeof formSchema>;

export default function PPFCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculatePPF>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearlyInvestment: 150000,
      years: 15,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculatePPF(data.yearlyInvestment, data.years);
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">PPF Calculator</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="yearlyInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yearly Investment (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
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
                        <Input {...field} type="number" min="15" max="50" />
                      </FormControl>
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
                    Total Investment
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.totalInvestment).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Interest Earned
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.totalInterest).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Maturity Value
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.maturityValue).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <ResultsChart
              data={results.yearlyData}
              title="PPF Investment Growth Over Time"
            />
          </div>
        )}
      </div>
    </div>
  );
}