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
import { calculateNSC } from "@/lib/calculators";

const formSchema = z.object({
  principal: z.coerce
    .number()
    .positive("Investment amount must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NSCCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateNSC>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: 10000,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateNSC(data.principal);
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">NSC Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate returns on your National Savings Certificate (NSC) investment. NSC is a government-backed 
        savings scheme with a 5-year lock-in period, offering guaranteed returns and tax benefits under Section 80C.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="principal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Amount (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
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

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">How NSC Works</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong>Interest Rate:</strong> NSC currently offers 6.8% p.a. interest rate, 
                  which is compounded annually but payable at maturity.
                </p>
                <p>
                  <strong>Lock-in Period:</strong> 5 years mandatory lock-in period. Early 
                  withdrawal is allowed only in case of holder's death or by court order.
                </p>
                <p>
                  <strong>Interest Calculation:</strong>
                  <br />
                  • Year 1: Principal × 6.8%
                  <br />
                  • Subsequent Years: (Previous Year's Amount + Interest) × 6.8%
                  <br />
                  Interest is reinvested automatically.
                </p>
                <p>
                  <strong>Tax Benefits:</strong>
                  <br />
                  • Investment qualifies for tax deduction under Section 80C
                  <br />
                  • Interest is taxable but can be claimed as reinvested under 80C for first 4 years
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {results && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 grid gap-4">
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Investment Amount
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
                <div className="text-sm text-muted-foreground mt-4">
                  * Interest is compounded annually
                  <br />
                  * Final maturity value will be paid after 5 years
                </div>
              </CardContent>
            </Card>

            <ResultsChart
              data={results.yearlyData}
              title="NSC Investment Growth"
            />
          </div>
        )}
      </div>
    </div>
  );
}