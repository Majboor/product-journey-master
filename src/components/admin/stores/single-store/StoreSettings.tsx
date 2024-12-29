import { Tables } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface StoreSettingsProps {
  store: Tables<"categories">;
}

export const StoreSettings = ({ store }: StoreSettingsProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Template Type</Label>
          <Select defaultValue="single_product">
            <SelectTrigger>
              <SelectValue placeholder="Select template type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single_product">Single Product</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};