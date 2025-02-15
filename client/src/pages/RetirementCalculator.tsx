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
import { calculateRetirement } from "@/lib/calculators";

const formSchema = z.object({
  currentAge: z.string().transform(Number).pipe(
    z.number()
      .positive("Age must be positive")
      .max(100, "Age must be less than 100")
  ),
  retirementAge: z.string().transform(Number).pipe(
    z.number()
      .positive("Retirement age must be positive")
      .max(100, "Retirement age must be less than 100")
  ),
  monthlyExpenses: z.string().transform(Number).pipe(
    z.number().positive("Monthly expenses must be positive")
  ),
  currentSavings: z.string().transform(Number).pipe(
    z.number().min(0, "Current savings cannot be negative")
  ),
  monthlyInvestment: z.string().transform(Number).pipe(
    z.number().min(0, "Monthly investment cannot be negative")
  ),
  expectedReturn: z.string().transform(Number).pipe(
    z.number().positive("Expected return rate must be positive")
  ),
  inflationRate: z.string().transform(Number).pipe(
    z.number().min(0, "Inflation rate cannot be negative")
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function RetirementCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateRetirement>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentAge: 30,
      retirementAge: 60,
      monthlyExpenses: 50000,
      currentSavings: 1000000,
      monthlyInvestment: 20000,
      expectedReturn: 12,
      inflationRate: 6,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateRetirement(
      Number(data.currentAge),
      Number(data.retirementAge),
      Number(data.monthlyExpenses),
      Number(data.currentSavings),
      Number(data.monthlyInvestment),
      Number(data.expectedReturn),
      Number(data.inflationRate)
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Retirement Calculator</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Age</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="retirementAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Retirement Age</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="monthlyExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Expenses (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSavings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Savings (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Investment (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expectedReturn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Return (%)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.1" />
                        </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Calculate Retirement Plan
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
                    Required Retirement Corpus
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.requiredCorpus).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Expected Corpus (Current Path)
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.currentCorpus).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Additional Monthly Investment Needed
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.monthlyInvestmentNeeded).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <ResultsChart
              data={results.yearlyData}
              title="Retirement Corpus Growth"
            />
          </div>
        )}
      </div>
    </div>
  );
}