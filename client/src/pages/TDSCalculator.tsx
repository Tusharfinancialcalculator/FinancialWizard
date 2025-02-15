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
import { Checkbox } from "@/components/ui/checkbox";
import { calculateTDS } from "@/lib/calculators";

const formSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be positive"),
  paymentType: z.enum([
    "salary",
    "professional_fees",
    "rent",
    "commission",
    "interest",
    "contractor"
  ]),
  isNonResident: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const PAYMENT_TYPES = [
  { value: "salary", label: "Salary" },
  { value: "professional_fees", label: "Professional Fees" },
  { value: "rent", label: "Rent" },
  { value: "commission", label: "Commission" },
  { value: "interest", label: "Interest" },
  { value: "contractor", label: "Contractor Payment" },
];

export default function TDSCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateTDS>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 100000,
      paymentType: "salary",
      isNonResident: false,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateTDS(
      data.amount,
      data.paymentType,
      data.isNonResident
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">TDS Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate Tax Deducted at Source (TDS) for various types of payments. 
        Understand applicable rates, thresholds, and net payable amounts after TDS deduction.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PAYMENT_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isNonResident"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Non-Resident</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Check this if the payee is a non-resident of India
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Calculate TDS
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">TDS Guidelines</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong>Threshold Limits:</strong> TDS is applicable only when payment exceeds the specified threshold
                </p>
                <p>
                  <strong>Resident vs Non-Resident:</strong> Different TDS rates apply for residents and non-residents
                </p>
                <p>
                  <strong>Payment Types:</strong> Each type of payment has specific TDS rates and thresholds
                </p>
                <p>
                  <strong>Compliance:</strong> TDS must be deposited with the government within specified timelines
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
                  <h3 className="text-lg font-semibold mb-4">TDS Calculation Results</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Gross Amount:</span>
                      <p className="font-medium">₹{results.grossAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">TDS Rate:</span>
                      <p className="font-medium">{results.tdsRate}%</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">TDS Amount:</span>
                      <p className="font-medium">₹{results.tdsAmount.toLocaleString()}</p>
                    </div>
                    <div className="pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Net Payable Amount:</span>
                      <p className="text-xl font-semibold text-primary">
                        ₹{results.netAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Applicability</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Threshold Limit:</span>
                      <p className="font-medium">₹{results.tdsThreshold.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">TDS Applicable:</span>
                      <p className="font-medium">{results.isTDSApplicable ? "Yes" : "No"}</p>
                    </div>
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
