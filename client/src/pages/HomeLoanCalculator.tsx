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
import { calculateEMI } from "@/lib/calculators";

const formSchema = z.object({
  principal: z.string().transform(Number).pipe(
    z.number().positive("Loan amount must be positive")
  ),
  rate: z.string().transform(Number).pipe(
    z.number().positive("Interest rate must be positive")
  ),
  tenure: z.string().transform(Number).pipe(
    z.number().positive("Tenure must be positive")
  ),
});

type FormValues = {
  principal: string;
  rate: string;
  tenure: string;
};

export default function HomeLoanCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateEMI>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: "5000000",
      rate: "8.5",
      tenure: "20",
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateEMI(
      Number(data.principal),
      Number(data.rate),
      Number(data.tenure)
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Home Loan EMI Calculator</h1>

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
                      <FormLabel>Home Loan Amount (₹)</FormLabel>
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
                  name="tenure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Tenure (Years)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Calculate Home Loan EMI
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
                  <h3 className="text-sm text-muted-foreground">Monthly EMI</h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.emi).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Total Interest Payable
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
              </CardContent>
            </Card>

            <ResultsChart
              data={results.monthlyData}
              title="Outstanding Loan Balance Over Time"
            />
          </div>
        )}
      </div>
    </div>
  );
}