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
import { calculateStepUpSIP } from "@/lib/calculators";

const formSchema = z.object({
  monthlyInvestment: z.string().transform(Number).pipe(
    z.number().positive("Monthly investment must be positive")
  ),
  annualIncrease: z.string().transform(Number).pipe(
    z.number().min(0, "Annual increase cannot be negative")
  ),
  years: z.string().transform(Number).pipe(
    z.number().positive("Years must be positive")
  ),
  expectedReturn: z.string().transform(Number).pipe(
    z.number().positive("Expected return rate must be positive")
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function StepUpSIPCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateStepUpSIP>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyInvestment: "10000",
      annualIncrease: "10",
      years: "10",
      expectedReturn: "12",
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateStepUpSIP(
      Number(data.monthlyInvestment),
      Number(data.annualIncrease),
      Number(data.years),
      Number(data.expectedReturn)
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Step-Up SIP Calculator</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="monthlyInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Monthly Investment (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="annualIncrease"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Step-Up (%)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.1" />
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
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedReturn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Return Rate (%)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.1" />
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
                    Total Returns
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.totalReturns).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Final Monthly Investment
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.finalMonthlyInvestment).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <ResultsChart
              data={results.yearlyData}
              title="Step-Up SIP Growth Over Time"
            />
          </div>
        )}
      </div>
    </div>
  );
}
