import { Card, CardContent } from "@/components/ui/card";

export default function InflationCalculator() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inflation Calculator</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Calculate how inflation affects the value of money over time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
