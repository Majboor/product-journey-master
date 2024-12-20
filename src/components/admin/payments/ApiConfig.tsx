import { Card } from "@/components/ui/card";
import { ApiKeySection } from "./api-config/ApiKeySection";
import { TestModeSection } from "./api-config/TestModeSection";

export const ApiConfig = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Ziina API Configuration</h2>
      <div className="space-y-6">
        <ApiKeySection />
        <TestModeSection />
      </div>
    </Card>
  );
};