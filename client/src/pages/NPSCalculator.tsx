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

const formSchema = z.object({
  monthlyContribution: z.string().transform(Number).pipe(
    z.number().positive("Monthly contribution must be positive")
  ),
  currentAge: z.string().transform(Number).pipe(
    z.number().min(18, "Age must be at least 18").max(65, "Age must be less than 65")
  ),
  retirementAge: z.string().transform(Number).pipe(
    z.number().min(60, "Retirement age must be at least 60")
  ),
  equityAllocation: z.string().transform(Number).pipe(
    z.number().min(0, "Equity allocation must be between 0 and 75").max(75, "Maximum equity allocation is 75%")
  ),
  expectedReturn: z.string().transform(Number).pipe(
    z.number().positive("Expected return must be positive")
  ),
});

type FormValues = z.infer<typeof formSchema>;

function calculateNPS(
  monthlyContribution: number,
  currentAge: number,
  retirementAge: number,
  equityAllocation: number,
  expectedReturn: number
) {
  const yearsToRetirement = retirementAge - currentAge;
  const monthlyRate = expectedReturn / 100 / 12;
  const totalMonths = yearsToRetirement * 12;
  
  let yearlyData = [];
  let totalInvestment = 0;
  let currentValue = 0;
  
  for (let year = 1; year <= yearsToRetirement; year++) {
    for (let month = 1; month <= 12; month++) {
      totalInvestment += monthlyContribution;
      currentValue = (currentValue + monthlyContribution) * (1 + monthlyRate);
    }
    yearlyData.push({
      year,
      investment: totalInvestment,
      value: currentValue,
    });
  }

  return {
    totalInvestment,
    maturityValue: currentValue,
    totalReturns: currentValue - totalInvestment,
    yearlyData,
  };
}

export default function NPSCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateNPS>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyContribution: "5000",
      currentAge: "30",
      retirementAge: "60",
      equityAllocation: "50",
      expectedReturn: "10",
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateNPS(
      data.monthlyContribution,
      data.currentAge,
      data.retirementAge,
      data.equityAllocation,
      data.expectedReturn
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">NPS Calculator</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="monthlyContribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Contribution (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Age (years)</FormLabel>
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
                      <FormLabel>Retirement Age (years)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equityAllocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equity Allocation (%)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" max="75" />
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
                      <FormLabel>Expected Return (% per annum)</FormLabel>
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
              title="NPS Investment Growth Over Time"
            />
          </div>
        )}
      </div>
    </div>
  );
}
