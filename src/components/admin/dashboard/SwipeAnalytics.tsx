import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface SwipeAnalyticsProps {
  data: Array<{
    page: string;
    left: number;
    right: number;
  }>;
}

export const SwipeAnalytics = ({ data }: SwipeAnalyticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Swipe Events by Page</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              left: {
                theme: {
                  light: "hsl(var(--destructive))",
                  dark: "hsl(var(--destructive))",
                },
              },
              right: {
                theme: {
                  light: "hsl(var(--primary))",
                  dark: "hsl(var(--primary))",
                },
              },
            }}
          >
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="left" fill="var(--color-left)" name="Left Swipes" stackId="swipes" />
              <Bar dataKey="right" fill="var(--color-right)" name="Right Swipes" stackId="swipes" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};