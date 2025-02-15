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
import { calculateCAGR } from "@/lib/calculators";

const formSchema = z.object({
  initialValue: z.coerce
    .number()
    .positive("Initial value must be positive"),
  finalValue: z.coerce
    .number()
    .positive("Final value must be positive"),
  years: z.coerce
    .number()
    .positive("Years must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CAGRCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateCAGR>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialValue: 100000,
      finalValue: 200000,
      years: 5,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateCAGR(
      data.initialValue,
      data.finalValue,
      data.years
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CAGR Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate the Compound Annual Growth Rate (CAGR) of your investments.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="initialValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Investment (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="finalValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Final Investment Value (₹)</FormLabel>
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
                      <FormLabel>Time Period (Years)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Calculate CAGR
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Compound Annual Growth Rate (CAGR)
                  </h3>
                  <p className="text-2xl font-semibold">
                    {results.cagrPercentage}%
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
