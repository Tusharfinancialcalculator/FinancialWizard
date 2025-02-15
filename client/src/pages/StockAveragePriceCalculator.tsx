import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Trash2 } from "lucide-react";

const purchaseSchema = z.object({
  quantity: z.string().transform(Number).pipe(
    z.number().positive("Quantity must be positive")
  ),
  price: z.string().transform(Number).pipe(
    z.number().positive("Price must be positive")
  ),
});

const formSchema = z.object({
  purchases: z.array(purchaseSchema).min(1, "Add at least one purchase"),
});

type Purchase = z.infer<typeof purchaseSchema>;
type FormValues = z.infer<typeof formSchema>;

export default function StockAveragePriceCalculator() {
  const [results, setResults] = useState<{
    totalQuantity: number;
    totalInvestment: number;
    averagePrice: number;
  }>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchases: [{ quantity: "", price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "purchases",
    control: form.control,
  });

  function onSubmit(data: FormValues) {
    const totalQuantity = data.purchases.reduce(
      (sum, purchase) => sum + Number(purchase.quantity),
      0
    );

    const totalInvestment = data.purchases.reduce(
      (sum, purchase) => sum + (Number(purchase.quantity) * Number(purchase.price)),
      0
    );

    const averagePrice = totalInvestment / totalQuantity;

    setResults({
      totalQuantity,
      totalInvestment,
      averagePrice,
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Stock Average Price Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Calculate the average purchase price of your stock investments by entering the quantity
        and price for each purchase.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end">
                      <FormField
                        control={form.control}
                        name={`purchases.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`purchases.${index}.price`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Price per Share (₹)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.01" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        onClick={() => remove(index)}
                        disabled={index === 0 && fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ quantity: "", price: "" })}
                  className="w-full"
                >
                  Add Another Purchase
                </Button>

                <Button type="submit" className="w-full">
                  Calculate Average Price
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardContent className="p-6 grid gap-4">
              <div>
                <h3 className="text-sm text-muted-foreground">
                  Total Quantity
                </h3>
                <p className="text-2xl font-semibold">
                  {results.totalQuantity.toLocaleString()} shares
                </p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground">
                  Total Investment
                </h3>
                <p className="text-2xl font-semibold">
                  ₹{Math.round(results.totalInvestment).toLocaleString()}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground">
                  Average Price per Share
                </h3>
                <p className="text-2xl font-semibold">
                  ₹{results.averagePrice.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}