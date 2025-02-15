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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider, TooltipHint } from "@/components/ui/tooltip";
import ResultsChart from "@/components/calculators/ResultsChart";
import { calculateRetirement } from "@/lib/calculators";
import { AlertCircle, BadgeDollarSign } from "lucide-react";

const formSchema = z.object({
  currentAge: z.string().transform(Number).pipe(
    z.number()
      .positive("Age must be positive")
      .max(100, "Age must be less than 100")
  ),
  retirementAge: z.string().transform(Number).pipe(
    z.number()
      .positive("Retirement age must be positive")
      .max(100, "Retirement age must be less than 100")
  ),
  monthlyExpenses: z.string().transform(Number).pipe(
    z.number().positive("Monthly expenses must be positive")
  ),
  currentSavings: z.string().transform(Number).pipe(
    z.number().min(0, "Current savings cannot be negative")
  ),
  monthlyInvestment: z.string().transform(Number).pipe(
    z.number().min(0, "Monthly investment cannot be negative")
  ),
  expectedReturn: z.string().transform(Number).pipe(
    z.number().positive("Expected return rate must be positive")
  ),
  inflationRate: z.string().transform(Number).pipe(
    z.number().min(0, "Inflation rate cannot be negative")
  ),
  annualExpenseIncrease: z.string().transform(Number).pipe(
    z.number().min(0, "Annual expense increase cannot be negative")
  ),
  annualInvestmentIncrease: z.string().transform(Number).pipe(
    z.number().min(0, "Annual investment increase cannot be negative")
  ),
  fireType: z.enum(["lean", "mid", "fat"]),
});

type FormValues = {
  currentAge: string;
  retirementAge: string;
  monthlyExpenses: string;
  currentSavings: string;
  monthlyInvestment: string;
  expectedReturn: string;
  inflationRate: string;
  annualExpenseIncrease: string;
  annualInvestmentIncrease: string;
  fireType: "lean" | "mid" | "fat";
};

const fireTypeDescriptions = {
  lean: {
    title: "Lean FIRE",
    description: "Conservative approach with 3.33% withdrawal rate (30x annual expenses). Prioritizes financial security with a larger safety margin.",
    multiplier: 30,
  },
  mid: {
    title: "Mid FIRE",
    description: "Traditional approach with 4% withdrawal rate (25x annual expenses). Balanced between security and lifestyle maintenance.",
    multiplier: 25,
  },
  fat: {
    title: "Fat FIRE",
    description: "Aggressive approach with 5% withdrawal rate (20x annual expenses). Aims for a more luxurious retirement lifestyle.",
    multiplier: 20,
  },
};

export default function RetirementCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateRetirement>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentAge: "30",
      retirementAge: "60",
      monthlyExpenses: "50000",
      currentSavings: "1000000",
      monthlyInvestment: "20000",
      expectedReturn: "12",
      inflationRate: "6",
      annualExpenseIncrease: "0",
      annualInvestmentIncrease: "0",
      fireType: "mid",
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateRetirement(
      Number(data.currentAge),
      Number(data.retirementAge),
      Number(data.monthlyExpenses),
      Number(data.currentSavings),
      Number(data.monthlyInvestment),
      Number(data.expectedReturn),
      Number(data.inflationRate),
      Number(data.annualExpenseIncrease),
      Number(data.annualInvestmentIncrease),
      data.fireType
    );
    setResults(result);
  }

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Retirement Calculator</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currentAge"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Current Age</FormLabel>
                            <TooltipHint content="Your current age in years" />
                          </div>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="retirementAge"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Retirement Age</FormLabel>
                            <TooltipHint content="The age at which you plan to retire" />
                          </div>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* FIRE Strategy Selection - Full Width */}
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="fireType"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>FIRE Strategy</FormLabel>
                            <TooltipHint 
                              content="Choose your FIRE (Financial Independence, Retire Early) approach based on your retirement goals" 
                              side="top"
                            />
                          </div>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select FIRE strategy" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-[300px] md:w-[400px]">
                              {Object.entries(fireTypeDescriptions).map(([key, { title, description }]) => (
                                <SelectItem key={key} value={key} className="py-3">
                                  <div className="flex flex-col gap-1">
                                    <span className="font-medium">{title}</span>
                                    <span className="text-xs text-muted-foreground whitespace-normal break-words">{description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="monthlyExpenses"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Monthly Expenses (₹)</FormLabel>
                          <TooltipHint content="Your current monthly expenses that need to be covered in retirement" />
                        </div>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="annualExpenseIncrease"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Annual Expense Increase (%)</FormLabel>
                          <TooltipHint content="Expected yearly increase in expenses beyond inflation" />
                        </div>
                        <FormControl>
                          <Input {...field} type="number" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentSavings"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Current Savings (₹)</FormLabel>
                          <TooltipHint content="Total amount currently saved for retirement" />
                        </div>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monthlyInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Monthly Investment (₹)</FormLabel>
                          <TooltipHint content="Amount you plan to invest monthly towards retirement" />
                        </div>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="annualInvestmentIncrease"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Annual Investment Increase (%)</FormLabel>
                          <TooltipHint content="Yearly percentage increase in your monthly investment amount" />
                        </div>
                        <FormControl>
                          <Input {...field} type="number" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expectedReturn"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Expected Return (%)</FormLabel>
                            <TooltipHint content="Expected annual return on your investments" />
                          </div>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="inflationRate"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Inflation Rate (%)</FormLabel>
                            <TooltipHint content="Expected annual inflation rate" />
                          </div>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Calculate Retirement Plan
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {results && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Understanding Your FIRE Strategy</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <BadgeDollarSign className="h-5 w-5" />
                    <p className="font-medium">
                      Withdrawal Rate: {results.withdrawalRate.toFixed(2)}%
                    </p>
                  </div>
                  <p>
                    <strong>Required Corpus:</strong> Based on your selected FIRE strategy, which uses a {results.withdrawalRate.toFixed(2)}% withdrawal rate
                    ({Math.round(100 / results.withdrawalRate)}x annual expenses). This approach is designed to sustain your retirement for 30+ years.
                  </p>
                  <p>
                    <strong>Expected Corpus:</strong> Combines your current savings (grown at the expected return rate) with your monthly investments (increased annually if specified) until retirement.
                  </p>
                  <p>
                    <strong>Monthly Investment Needed:</strong> Additional investment required to bridge any gap between required and expected corpus.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 grid gap-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground">
                      Monthly Expenses at Retirement
                    </h3>
                    <p className="text-2xl font-semibold">
                      ₹{Math.round(results.futureMonthlyExpenses).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Adjusted for inflation and annual increases
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm text-muted-foreground">
                      Required Retirement Corpus
                    </h3>
                    <p className="text-2xl font-semibold">
                      ₹{Math.round(results.requiredCorpus).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Based on {results.withdrawalRate.toFixed(2)}% withdrawal rate
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm text-muted-foreground">
                      Expected Corpus (Current Path)
                    </h3>
                    <p className="text-2xl font-semibold">
                      ₹{Math.round(results.currentCorpus).toLocaleString()}
                    </p>
                  </div>

                  {results.shortfall > 0 && (
                    <div className="flex items-start gap-2 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      <div>
                        <p className="font-semibold">Shortfall: ₹{Math.round(results.shortfall).toLocaleString()}</p>
                        <p className="text-sm">
                          Additional monthly investment needed: ₹{Math.round(results.monthlyInvestmentNeeded).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <ResultsChart
                data={results.yearlyData}
                title="Retirement Corpus Growth"
              />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}