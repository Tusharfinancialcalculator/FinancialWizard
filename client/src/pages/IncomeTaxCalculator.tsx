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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateIncomeTax } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  salary: z.coerce
    .number()
    .min(0, "Salary cannot be negative"),
  otherIncome: z.coerce
    .number()
    .min(0, "Other income cannot be negative"),
  deductions: z.coerce
    .number()
    .min(0, "Deductions cannot be negative"),
  regime: z.enum(["old", "new"]),
});

type FormValues = z.infer<typeof formSchema>;

const newRegimeSlabs = [
  { range: "Up to ₹3,00,000", rate: "0%" },
  { range: "₹3,00,001 - ₹6,00,000", rate: "5%" },
  { range: "₹6,00,001 - ₹9,00,000", rate: "10%" },
  { range: "₹9,00,001 - ₹12,00,000", rate: "15%" },
  { range: "₹12,00,001 - ₹15,00,000", rate: "20%" },
  { range: "Above ₹15,00,000", rate: "30%" },
];

const oldRegimeSlabs = [
  { range: "Up to ₹2,50,000", rate: "0%" },
  { range: "₹2,50,001 - ₹5,00,000", rate: "5%" },
  { range: "₹5,00,001 - ₹10,00,000", rate: "20%" },
  { range: "Above ₹10,00,000", rate: "30%" },
];

export default function IncomeTaxCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateIncomeTax>>();
  const [selectedRegime, setSelectedRegime] = useState<"old" | "new">("new");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salary: 800000,
      otherIncome: 0,
      deductions: 150000,
      regime: "new",
    },
  });

  function onSubmit(data: FormValues) {
    // Calculate gross income
    const grossIncome = data.salary + data.otherIncome;
    const result = calculateIncomeTax(grossIncome, data.deductions, data.regime);

    // Store gross income and calculate take-home
    setResults({
      ...result,
      grossIncome,
      takeHome: grossIncome - result.taxAmount
    });
    setSelectedRegime(data.regime);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Income Tax Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate your income tax for FY 2024-25 (AY 2025-26) under both new and old tax regimes.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
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

          {/* Tax Slabs Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tax Slabs (FY 2024-25)</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">New Tax Regime</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Income Range</TableHead>
                        <TableHead className="text-right">Tax Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newRegimeSlabs.map((slab, index) => (
                        <TableRow key={index}>
                          <TableCell>{slab.range}</TableCell>
                          <TableCell className="text-right">{slab.rate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Old Tax Regime</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Income Range</TableHead>
                        <TableHead className="text-right">Tax Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {oldRegimeSlabs.map((slab, index) => (
                        <TableRow key={index}>
                          <TableCell>{slab.range}</TableCell>
                          <TableCell className="text-right">{slab.rate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <p className="text-sm text-muted-foreground mt-2">
                    * Old regime allows various deductions under Section 80C, HRA, etc.
                  </p>
                </div>
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
                    Gross Total Income
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{results.grossIncome.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Taxable Income
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{results.taxableIncome.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Total Tax Payable
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{results.taxAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    Net Take-Home
                  </h3>
                  <p className="text-2xl font-semibold">
                    ₹{results.takeHome.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Tax Breakup</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Income Slab</TableHead>
                      <TableHead className="text-right">Tax Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.slabwiseBreakup.map((slab, index) => (
                      <TableRow key={index}>
                        <TableCell>{slab.slab}</TableCell>
                        <TableCell className="text-right">₹{slab.tax.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}