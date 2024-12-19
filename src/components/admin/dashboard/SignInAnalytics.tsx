import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface SignInAnalyticsProps {
  data: Array<{
    page: string;
    attempts: number;
  }>;
}

export const SignInAnalytics = ({ data }: SignInAnalyticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign-in Attempts by Page</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              attempts: {
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
              <Bar dataKey="attempts" fill="var(--color-attempts)" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};