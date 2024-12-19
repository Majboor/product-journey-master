import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PageAnalyticsProps {
  analytics: Array<{
    page: string;
    totalVisits: number;
    uniqueVisitors: number;
  }>;
}

export const PageAnalytics = ({ analytics }: PageAnalyticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analytics.map((page) => (
            <div key={page.page} className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="font-medium">/{page.page}</h3>
                <p className="text-sm text-muted-foreground">
                  {page.uniqueVisitors} unique visitors
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{page.totalVisits} visits</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};