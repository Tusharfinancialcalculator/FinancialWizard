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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateIncomeTax } from "@/lib/calculators";

const formSchema = z.object({
  salary: z.string().transform(Number).pipe(
    z.number().min(0, "Salary cannot be negative")
  ),
  otherIncome: z.string().transform(Number).pipe(
    z.number().min(0, "Other income cannot be negative")
  ),
  deductions: z.string().transform(Number).pipe(
    z.number().min(0, "Deductions cannot be negative")
  ),
  regime: z.enum(["old", "new"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function IncomeTaxCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateIncomeTax>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salary: "500000",
      otherIncome: "0",
      deductions: "150000",
      regime: "new",
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateIncomeTax(
      Number(data.salary),
      Number(data.otherIncome),
      Number(data.deductions),
      data.regime
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Income Tax Calculator</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Salary (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Income (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deductions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Deductions (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="regime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Regime</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tax regime" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">New Regime</SelectItem>
                          <SelectItem value="old">Old Regime</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Calculate Tax
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
                    Gross Total Income
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.grossIncome).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Taxable Income
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.taxableIncome).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Total Tax Payable
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.totalTax).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Net Take-Home
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.takeHome).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
