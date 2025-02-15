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
import { calculateSalary } from "@/lib/calculators";

const formSchema = z.object({
  basicSalary: z.coerce
    .number()
    .positive("Basic salary must be positive"),
  hra: z.coerce
    .number()
    .nonnegative("HRA cannot be negative")
    .default(0),
  basicAllowance: z.coerce
    .number()
    .nonnegative("Basic allowance cannot be negative")
    .default(0),
  specialAllowance: z.coerce
    .number()
    .nonnegative("Special allowance cannot be negative")
    .default(0),
  conveyanceAllowance: z.coerce
    .number()
    .nonnegative("Conveyance allowance cannot be negative")
    .default(0),
  medicalAllowance: z.coerce
    .number()
    .nonnegative("Medical allowance cannot be negative")
    .default(0),
  otherAllowances: z.coerce
    .number()
    .nonnegative("Other allowances cannot be negative")
    .default(0),
  extraDeductions: z.coerce
    .number()
    .nonnegative("Extra deductions cannot be negative")
    .default(0),
});

type FormValues = z.infer<typeof formSchema>;

export default function SalaryCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateSalary>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basicSalary: 50000,
      hra: 20000,
      basicAllowance: 5000,
      specialAllowance: 8000,
      conveyanceAllowance: 1600,
      medicalAllowance: 1250,
      otherAllowances: 0,
      extraDeductions: 0,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateSalary(
      data.basicSalary,
      data.hra,
      data.basicAllowance,
      data.specialAllowance,
      data.conveyanceAllowance,
      data.medicalAllowance,
      data.otherAllowances,
      data.extraDeductions
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Salary Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate your net take-home salary by entering your salary components and deductions.
        Get a detailed breakdown of your monthly earnings and various deductions.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="basicSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Basic Salary (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HRA (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="basicAllowance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Basic Allowance (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialAllowance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Allowance (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="conveyanceAllowance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conveyance Allowance (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalAllowance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Allowance (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otherAllowances"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Allowances (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="extraDeductions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extra Deductions (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Calculate Salary
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Salary Components</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong>Basic Salary:</strong> The fixed amount paid to an employee
                </p>
                <p>
                  <strong>HRA:</strong> House Rent Allowance for accommodation expenses
                </p>
                <p>
                  <strong>Allowances:</strong> Additional components like special, conveyance, and medical allowances
                </p>
                <p>
                  <strong>Deductions:</strong> Mandatory deductions like PF, PT, and income tax
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
                  <h3 className="text-lg font-semibold mb-4">Salary Breakdown</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Basic Salary:</span>
                      <p className="font-medium">₹{results.basicSalary.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Gross Salary:</span>
                      <p className="font-medium">₹{results.grossSalary.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Monthly Allowances</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">HRA:</span>
                      <p className="font-medium">₹{results.monthlyBreakdown.hra.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Basic Allowance:</span>
                      <p className="font-medium">₹{results.monthlyBreakdown.basicAllowance.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Special Allowance:</span>
                      <p className="font-medium">₹{results.monthlyBreakdown.specialAllowance.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Conveyance Allowance:</span>
                      <p className="font-medium">₹{results.monthlyBreakdown.conveyanceAllowance.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Medical Allowance:</span>
                      <p className="font-medium">₹{results.monthlyBreakdown.medicalAllowance.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Other Allowances:</span>
                      <p className="font-medium">₹{results.monthlyBreakdown.otherAllowances.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Deductions</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Provident Fund:</span>
                      <p className="font-medium">₹{results.deductions.providentFund.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Professional Tax:</span>
                      <p className="font-medium">₹{results.deductions.professionalTax.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Income Tax:</span>
                      <p className="font-medium">₹{results.deductions.incomeTax.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Net Take-Home Salary:</span>
                  <p className="text-xl font-semibold text-primary">
                    ₹{results.netSalary.toLocaleString()}
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
