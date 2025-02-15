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
import { calculateGST } from "@/lib/calculators";

const formSchema = z.object({
  baseAmount: z.coerce
    .number()
    .positive("Amount must be positive"),
  gstRate: z.coerce
    .number()
    .positive("GST rate must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

const GST_RATES = [
  { value: "5", label: "5%" },
  { value: "12", label: "12%" },
  { value: "18", label: "18%" },
  { value: "28", label: "28%" },
];

export default function GSTCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateGST>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseAmount: 1000,
      gstRate: 18,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateGST(data.baseAmount, data.gstRate);
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">GST Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate GST components (CGST & SGST) and total amount for your transactions.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="baseAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Amount (₹)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gstRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GST Rate (%)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select GST rate" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GST_RATES.map((rate) => (
                            <SelectItem key={rate.value} value={rate.value}>
                              {rate.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Calculate GST
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
                  <h3 className="text-sm text-muted-foreground">Base Amount</h3>
                  <p className="text-lg font-medium">₹{results.baseAmount.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">Total GST</h3>
                  <p className="text-2xl font-semibold text-primary">
                    ₹{results.totalGST.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">Final Amount</h3>
                  <p className="text-xl font-semibold">₹{results.totalAmount.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">GST Breakdown</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">CGST ({results.breakdown.cgstRate}%):</span>
                    <p className="font-medium">₹{results.cgst.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">SGST ({results.breakdown.sgstRate}%):</span>
                    <p className="font-medium">₹{results.sgst.toLocaleString()}</p>
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
