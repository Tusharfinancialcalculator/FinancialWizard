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
import { calculateFlatVsReducingRate } from "@/lib/calculators";

const formSchema = z.object({
  principal: z.coerce
    .number()
    .positive("Principal amount must be positive"),
  tenure: z.coerce
    .number()
    .positive("Tenure must be positive"),
  flatRate: z.coerce
    .number()
    .positive("Flat interest rate must be positive"),
  reducingRate: z.coerce
    .number()
    .positive("Reducing interest rate must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

export default function FlatVsReducingCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateFlatVsReducingRate>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: 100000,
      tenure: 2,
      flatRate: 12,
      reducingRate: 12,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateFlatVsReducingRate(
      data.principal,
      data.tenure,
      data.flatRate,
      data.reducingRate
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Flat vs. Reducing Rate Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Compare loan EMIs and total interest between flat and reducing balance interest rate methods.
        Understand how much you can save by choosing the right interest calculation method.
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
                        <FormLabel>Loan Amount (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
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
                          <Input {...field} type="number" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="flatRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flat Interest Rate (%)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reducingRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reducing Balance Rate (%)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Calculate and Compare
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Understanding Interest Methods</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong>Flat Rate Method:</strong>
                  <br />
                  • Interest is calculated on the full loan amount throughout the tenure
                  <br />
                  • EMI = (Principal + Total Interest) ÷ Tenure in months
                  <br />
                  • Generally results in higher effective interest rate
                </p>
                <p>
                  <strong>Reducing Balance Method:</strong>
                  <br />
                  • Interest is calculated on the remaining principal amount
                  <br />
                  • Monthly interest reduces as principal is repaid
                  <br />
                  • More favorable to borrowers
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
                  <h3 className="text-lg font-semibold mb-4">Flat Rate Results</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Monthly EMI:</span>
                      <p className="font-medium">₹{results.flatInterest.emi.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Interest:</span>
                      <p className="font-medium">₹{results.flatInterest.totalInterest.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Payment:</span>
                      <p className="font-medium">₹{results.flatInterest.totalPayment.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Reducing Balance Results</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Monthly EMI:</span>
                      <p className="font-medium">₹{results.reducingInterest.emi.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Interest:</span>
                      <p className="font-medium">₹{results.reducingInterest.totalInterest.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Payment:</span>
                      <p className="font-medium">₹{results.reducingInterest.totalPayment.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">Comparison</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Interest Saved with Reducing Balance:</span>
                      <p className="text-xl font-semibold text-primary">
                        ₹{results.comparison.interestSaved.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Effective Rate Difference:</span>
                      <p className="font-medium">{results.comparison.effectiveRateDiff}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ResultsChart
              data={[
                ...results.flatInterest.monthlyData.map((d, i) => ({
                  label: d.label,
                  value: d.value,
                })),
                ...results.reducingInterest.monthlyData.map((d, i) => ({
                  label: d.label,
                  value: d.value,
                }))
              ]}
              title="Outstanding Principal Comparison"
            />
          </div>
        )}
      </div>
    </div>
  );
}