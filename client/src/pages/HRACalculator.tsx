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
import ResultsChart from "@/components/calculators/ResultsChart";
import { calculateHRA } from "@/lib/calculators";

const formSchema = z.object({
  basicSalary: z.string().transform(Number).pipe(
    z.number().positive("Basic salary must be positive")
  ),
  rentPaid: z.string().transform(Number).pipe(
    z.number().positive("Rent paid must be positive")
  ),
  cityType: z.enum(["metro", "non-metro"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function HRACalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateHRA>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basicSalary: 50000,
      rentPaid: 20000,
      cityType: "metro",
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateHRA(
      Number(data.basicSalary),
      Number(data.rentPaid),
      data.cityType
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">HRA Calculator</h1>

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
                      <FormLabel>Basic Salary (₹/month)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rentPaid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rent Paid (₹/month)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="metro">Metro City</SelectItem>
                          <SelectItem value="non-metro">Non-Metro City</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Calculate HRA
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
                  <h3 className="text-sm text-muted-foreground">HRA Received</h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.hraReceived).toLocaleString()}/month
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">HRA Exemption</h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.hraExemption).toLocaleString()}/month
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">Taxable HRA</h3>
                  <p className="text-2xl font-semibold">
                    ₹{Math.round(results.taxableHRA).toLocaleString()}/month
                  </p>
                </div>
              </CardContent>
            </Card>

            <ResultsChart
              data={results.monthlyData}
              title="Monthly HRA Breakdown"
            />
          </div>
        )}
      </div>
    </div>
  );
}