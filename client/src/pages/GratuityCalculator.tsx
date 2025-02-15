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
import { calculateGratuity } from "@/lib/calculators";

const formSchema = z.object({
  basicSalary: z.coerce
    .number()
    .positive("Basic salary must be positive"),
  yearsOfService: z.coerce
    .number()
    .positive("Years of service must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

export default function GratuityCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateGratuity>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basicSalary: 50000,
      yearsOfService: 10,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateGratuity(
      data.basicSalary,
      data.yearsOfService
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gratuity Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate your gratuity amount as per the Payment of Gratuity Act. 
        You need to complete at least 5 years of continuous service to be eligible for gratuity.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="basicSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Basic Salary (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearsOfService"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Service</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Calculate Gratuity
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
                    Gratuity Status
                  </h3>
                  <p className="text-lg font-medium">
                    {results.isEligible 
                      ? "Eligible for Gratuity" 
                      : "Not Eligible (Minimum 5 years required)"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Gratuity Amount
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{results.gratuityAmount.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Calculation Breakdown</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Daily Wage:</span>
                    <p className="font-medium">₹{results.calculationBreakdown.dailyWage.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">15 Days Salary:</span>
                    <p className="font-medium">₹{results.calculationBreakdown.fifteenDaysSalary.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Years of Service:</span>
                    <p className="font-medium">{results.calculationBreakdown.yearsConsidered} years</p>
                  </div>
                  <div className="text-sm text-muted-foreground mt-4">
                    * Gratuity is calculated as (15 days × Basic Salary × Years of Service) ÷ 26
                    <br />
                    * Maximum gratuity amount is capped at ₹20 lakhs
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
