import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ScrollArea } from "@/components/ui/scroll-area";

interface SwipeAnalyticsProps {
  data: Array<{
    page: string;
    left: number;
    right: number;
    up?: number;
    down?: number;
    mouse_movements?: number;
  }>;
}

export const SwipeAnalytics = ({ data }: SwipeAnalyticsProps) => {
  // Filter out empty pages and format data for display
  const formattedData = data
    .filter(item => item.page) // Remove empty page entries
    .map(item => ({
      ...item,
      page: item.page === 'index' ? '/' : `/${item.page}`, // Format page names
    }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>User Interactions by Page</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <div className="h-[400px] min-w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={formattedData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
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
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="left" 
                  fill="hsl(var(--destructive))" 
                  name="Left Swipes" 
                  stackId="a"
                />
                <Bar 
                  dataKey="right" 
                  fill="hsl(var(--primary))" 
                  name="Right Swipes" 
                  stackId="a"
                />
                <Bar 
                  dataKey="up" 
                  fill="hsl(var(--success))" 
                  name="Scroll Up" 
                  stackId="b"
                />
                <Bar 
                  dataKey="down" 
                  fill="hsl(var(--warning))" 
                  name="Scroll Down" 
                  stackId="b"
                />
                <Bar 
                  dataKey="mouse_movements" 
                  fill="hsl(var(--secondary))" 
                  name="Mouse Movements" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};