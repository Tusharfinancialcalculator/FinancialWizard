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
import { calculateAPY } from "@/lib/calculators";

const formSchema = z.object({
  currentAge: z.coerce
    .number()
    .min(18, "Minimum age is 18 years")
    .max(40, "Maximum age is 40 years"),
  desiredPension: z.coerce
    .number()
    .min(1000, "Minimum pension is ₹1,000")
    .max(5000, "Maximum pension is ₹5,000"),
});

type FormValues = z.infer<typeof formSchema>;

export default function APYCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateAPY>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentAge: 25,
      desiredPension: 1000,
    },
  });

  function onSubmit(data: FormValues) {
    try {
      const result = calculateAPY(
        data.currentAge,
        data.desiredPension
      );
      setResults(result);
    } catch (error) {
      if (error instanceof Error) {
        form.setError("root", { message: error.message });
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">APY Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate your monthly contribution and benefits under the Atal Pension Yojana (APY) scheme.
        APY guarantees a minimum monthly pension between ₹1,000 and ₹5,000, starting at age 60.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Age (Years)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="desiredPension"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Monthly Pension (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="1000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Calculate APY Benefits
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
                    Monthly Contribution
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{results.monthlyContribution.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Guaranteed Monthly Pension
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{results.monthlyPension.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Total Investment Till Age 60
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{results.totalInvestment.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Corpus at Maturity
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{results.corpusAtMaturity.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <ResultsChart
              data={results.yearlyData}
              title="Projected Corpus Growth"
            />
          </div>
        )}
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">About APY Scheme</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Entry age: 18-40 years</li>
            <li>• Minimum guaranteed pension: ₹1,000 to ₹5,000 per month at age 60</li>
            <li>• Same pension amount to spouse after subscriber's demise</li>
            <li>• Return of corpus to nominees after both subscriber and spouse's demise</li>
            <li>• Government co-contribution: 50% of contribution or ₹1,000 per year (whichever is lower) for 5 years for non-tax payers who joined before 31st March 2016</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
