import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ButtonClicksAnalyticsProps {
  data: Array<{
    page: string;
    button: string;
    clicks: number;
  }>;
}

export const ButtonClicksAnalytics = ({ data }: ButtonClicksAnalyticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Button Clicks by Page</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(
            data.reduce((acc: Record<string, Array<{ button: string; clicks: number }>>, curr) => {
              if (!acc[curr.page]) {
                acc[curr.page] = [];
              }
              acc[curr.page].push({ button: curr.button, clicks: curr.clicks });
              return acc;
            }, {})
          ).map(([page, buttons]) => (
            <div key={page} className="border-b pb-4">
              <h3 className="font-medium mb-2">/{page}</h3>
              <div className="grid grid-cols-2 gap-2">
                {buttons.map((button) => (
                  <div key={button.button} className="flex justify-between items-center bg-muted p-2 rounded">
                    <span className="text-sm font-medium">{button.button}</span>
                    <span className="text-sm text-muted-foreground">{button.clicks} clicks</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};