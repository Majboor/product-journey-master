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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Page Visits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]"> {/* Increased height for better data visibility */}
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
              <BarChart 
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
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
                  dataKey="visits" 
                  fill="var(--color-visits)"
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};