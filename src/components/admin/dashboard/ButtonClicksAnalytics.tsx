import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ButtonClicksAnalyticsProps {
  data: Array<{
    page: string;
    button: string;
    clicks: number;
  }>;
}

export const ButtonClicksAnalytics = ({ data }: ButtonClicksAnalyticsProps) => {
  // Group clicks by page
  const pageGroups = data.reduce((acc: Record<string, Array<{ button: string; clicks: number }>>, curr) => {
    if (!acc[curr.page]) {
      acc[curr.page] = [];
    }
    acc[curr.page].push({ button: curr.button, clicks: curr.clicks });
    return acc;
  }, {});

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Button Clicks by Page</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {Object.entries(pageGroups).map(([page, buttons]) => (
              <div key={page} className="border-b pb-4 last:border-0">
                <h3 className="font-medium mb-3">/{page}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {buttons.map((button) => (
                    <div 
                      key={`${page}-${button.button}`} 
                      className="flex justify-between items-center bg-muted p-2 rounded"
                    >
                      <span className="text-sm font-medium truncate mr-2">
                        {button.button}
                      </span>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {button.clicks} clicks
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};