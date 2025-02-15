import { Card, CardContent } from "@/components/ui/card";

export default function SCSSCalculator() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Senior Citizen Savings Scheme Calculator</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Calculate returns from Senior Citizens Savings Scheme investments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
