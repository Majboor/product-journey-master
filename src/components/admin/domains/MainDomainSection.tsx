import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MainDomainSectionProps {
  onSubmit: (domain: string) => void;
}

export const MainDomainSection = ({ onSubmit }: MainDomainSectionProps) => {
  const [mainDomain, setMainDomain] = useState("");

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Main Domain</h2>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">
            Domain URL
          </label>
          <Input
            value={mainDomain}
            onChange={(e) => setMainDomain(e.target.value)}
            placeholder="Enter main domain (e.g., https://example.com)"
          />
        </div>
        <Button onClick={() => onSubmit(mainDomain)} disabled={!mainDomain}>
          Set Main Domain
        </Button>
      </div>
    </Card>
  );
};