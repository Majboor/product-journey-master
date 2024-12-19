import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="page" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis />
              <ChartTooltip />
              <Bar 
                dataKey="left" 
                fill="hsl(var(--destructive))" 
                name="Left Swipes" 
                stackId="swipes" 
              />
              <Bar 
                dataKey="right" 
                fill="hsl(var(--primary))" 
                name="Right Swipes" 
                stackId="swipes" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};