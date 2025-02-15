import { Card, CardContent } from "@/components/ui/card";

export default function StockAveragePriceCalculator() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Stock Average Price Calculator</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Calculate the average price of your stock investments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
