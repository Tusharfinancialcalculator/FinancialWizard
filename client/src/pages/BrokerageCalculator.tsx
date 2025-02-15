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
import { calculateBrokerage } from "@/lib/calculators";

const formSchema = z.object({
  type: z.enum(["delivery", "intraday", "futures", "options"]),
  buyPrice: z.coerce
    .number()
    .positive("Buy price must be positive"),
  sellPrice: z.coerce
    .number()
    .positive("Sell price must be positive"),
  quantity: z.coerce
    .number()
    .positive("Quantity must be positive")
    .int("Quantity must be a whole number"),
  strikePrice: z.coerce
    .number()
    .positive("Strike price must be positive")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TRANSACTION_TYPES = [
  { value: "delivery", label: "Equity Delivery" },
  { value: "intraday", label: "Equity Intraday" },
  { value: "futures", label: "Futures" },
  { value: "options", label: "Options" },
];

export default function BrokerageCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateBrokerage>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "delivery",
      buyPrice: 100,
      sellPrice: 110,
      quantity: 100,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateBrokerage(
      data.type,
      data.buyPrice,
      data.sellPrice,
      data.quantity,
      data.strikePrice
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Brokerage Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate brokerage charges, taxes, and other transaction costs for equity and F&O trades.
        Get a detailed breakdown of charges and find out your breakeven prices.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TRANSACTION_TYPES.map((type) => (
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
                    name="buyPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buy Price (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.05" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sellPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sell Price (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.05" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("type") === "options" && (
                    <FormField
                      control={form.control}
                      name="strikePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Strike Price (₹)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.05" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button type="submit" className="w-full">
                    Calculate Charges
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">About Charges</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong>Brokerage:</strong> Fixed or percentage-based fee charged by the broker
                </p>
                <p>
                  <strong>STT:</strong> Securities Transaction Tax levied by the government
                </p>
                <p>
                  <strong>Exchange Charges:</strong> Fees charged by stock exchanges
                </p>
                <p>
                  <strong>GST:</strong> 18% on brokerage and transaction charges
                </p>
                <p>
                  <strong>SEBI Charges:</strong> ₹1 per crore of turnover
                </p>
                <p>
                  <strong>Stamp Duty:</strong> State-wise charges on buy-side transactions
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
                  <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Buy Value:</span>
                      <p className="font-medium">₹{results.buyValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Sell Value:</span>
                      <p className="font-medium">₹{results.sellValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Turnover:</span>
                      <p className="font-medium">₹{results.totalTurnover.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Charges Breakdown</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Brokerage:</span>
                      <p className="font-medium">₹{results.brokerage.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">STT:</span>
                      <p className="font-medium">₹{results.stt.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Exchange Charges:</span>
                      <p className="font-medium">₹{results.exchangeCharges.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">GST:</span>
                      <p className="font-medium">₹{results.gst.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">SEBI Charges:</span>
                      <p className="font-medium">₹{results.sebi.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Stamp Duty:</span>
                      <p className="font-medium">₹{results.stampDuty.toLocaleString()}</p>
                    </div>
                    <div className="pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Total Charges:</span>
                      <p className="text-xl font-semibold text-primary">
                        ₹{results.totalCharges.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Profit/Loss Analysis</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Net P&L:</span>
                      <p className={`text-xl font-semibold ${
                        results.netProfitLoss >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        ₹{results.netProfitLoss.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Breakeven Price (Up):</span>
                      <p className="font-medium">₹{results.breakEvenPriceUp.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Breakeven Price (Down):</span>
                      <p className="font-medium">₹{results.breakEvenPriceDown.toLocaleString()}</p>
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
