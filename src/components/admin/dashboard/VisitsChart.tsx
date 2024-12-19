import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface VisitsChartProps {
  data: Array<{
    page: string;
    visits: number;
  }>;
}

export const VisitsChart = ({ data }: VisitsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Visits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]"> {/* Increased height for better visibility */}
          <ChartContainer
            config={{
              visits: {
                theme: {
                  light: "hsl(var(--primary))",
                  dark: "hsl(var(--primary))",
                },
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="visits" fill="var(--color-visits)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};