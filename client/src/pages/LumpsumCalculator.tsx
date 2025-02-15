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
import { calculateLumpsum } from "@/lib/calculators";

const formSchema = z.object({
  principal: z.coerce.number().positive("Principal amount must be positive"),
  years: z.coerce.number().positive("Years must be positive"),
  expectedReturn: z.coerce.number().positive("Return rate must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LumpsumCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateLumpsum>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: 100000,
      years: 5,
      expectedReturn: 12,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateLumpsum(
      data.principal,
      data.years,
      data.expectedReturn
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Lumpsum Calculator</h1>

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
                      <FormLabel>Principal Amount (₹)</FormLabel>
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
                      <FormLabel>Expected Return Rate (% per annum)</FormLabel>
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
                    Initial Investment
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
              title="Investment Growth Over Time"
            />
          </div>
        )}
      </div>
    </div>
  );
}