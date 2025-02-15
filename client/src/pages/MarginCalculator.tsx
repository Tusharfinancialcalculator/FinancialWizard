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
import { calculateMargin } from "@/lib/calculators";

const formSchema = z.object({
  type: z.enum(["equity", "futures", "options"]),
  price: z.coerce
    .number()
    .positive("Price must be positive"),
  quantity: z.coerce
    .number()
    .positive("Quantity must be positive")
    .int("Quantity must be a whole number"),
  lotSize: z.coerce
    .number()
    .positive("Lot size must be positive")
    .int("Lot size must be a whole number"),
  volatility: z.coerce
    .number()
    .positive("Volatility must be positive")
    .max(100, "Volatility cannot exceed 100%"),
});

type FormValues = z.infer<typeof formSchema>;

const MARKET_TYPES = [
  { value: "equity", label: "Equity" },
  { value: "futures", label: "Futures" },
  { value: "options", label: "Options" },
];

export default function MarginCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateMargin>>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "equity",
      price: 100,
      quantity: 100,
      lotSize: 1,
      volatility: 15,
    },
  });

  function onSubmit(data: FormValues) {
    const result = calculateMargin(
      data.type,
      data.price,
      data.quantity,
      data.lotSize,
      data.volatility
    );
    setResults(result);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Margin Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate required margins for equity and F&O trading. Understand VAR, SPAN, and exposure margins
        to better manage your trading capital.
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
                        <FormLabel>Market Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select market type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MARKET_TYPES.map((type) => (
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
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

                  {form.watch("type") !== "equity" && (
                    <FormField
                      control={form.control}
                      name="lotSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lot Size</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="volatility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Volatility (%)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Calculate Margin
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Understanding Margins</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong>VAR Margin:</strong> Value at Risk margin based on stock volatility
                </p>
                <p>
                  <strong>SPAN Margin:</strong> Initial margin for F&O trades, based on potential portfolio loss
                </p>
                <p>
                  <strong>Exposure Margin:</strong> Additional margin for market-to-market losses
                </p>
                <p>
                  <strong>Total Margin:</strong> Sum of all applicable margins required to take a position
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
                  <h3 className="text-lg font-semibold mb-4">Margin Requirements</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Total Position Value:</span>
                      <p className="font-medium">₹{results.totalValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">VAR Margin:</span>
                      <p className="font-medium">₹{results.varMargin.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Exposure Margin:</span>
                      <p className="font-medium">₹{results.exposureMargin.toLocaleString()}</p>
                    </div>
                    {(form.watch("type") === "futures" || form.watch("type") === "options") && (
                      <div>
                        <span className="text-sm text-muted-foreground">SPAN Margin:</span>
                        <p className="font-medium">₹{results.spanMargin.toLocaleString()}</p>
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Total Margin Required:</span>
                      <p className="text-xl font-semibold text-primary">
                        ₹{results.totalMargin.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Margin Percentage:</span>
                      <p className="font-medium">{results.marginPercentage}%</p>
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
