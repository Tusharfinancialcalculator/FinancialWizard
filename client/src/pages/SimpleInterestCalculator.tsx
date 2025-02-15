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
import { calculateSimpleInterest } from "@/lib/calculators";

const formSchema = z.object({
  principal: z.coerce.number().positive("Principal amount must be positive"),
  rate: z.coerce.number().positive("Interest rate must be positive"),
  time: z.coerce.number().positive("Time period must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

export default function SimpleInterestCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateSimpleInterest>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: 10000,
      rate: 5,
      time: 5,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateSimpleInterest(
      data.principal,
      data.rate,
      data.time
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Simple Interest Calculator</h1>

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
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate (% per annum)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
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
                  Calculate Interest
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
                    Principal Amount
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.amount - results.interest).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Interest Earned
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.interest).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Total Amount
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.amount).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <ResultsChart
              data={results.yearlyData}
              title="Amount Growth Over Time"
            />
          </div>
        )}
      </div>
    </div>
  );
}