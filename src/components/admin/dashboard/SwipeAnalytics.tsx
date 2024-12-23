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
  // Process and aggregate data for all pages
  const processedData = data.reduce((acc, curr) => {
    if (!curr.page) return acc;
    
    // Format the page name
    const formattedPage = curr.page === 'index' ? '/' : `/${curr.page}`;
    
    // Find existing entry or create new one
    const existingEntry = acc.find(item => item.page === formattedPage);
    
    if (existingEntry) {
      // Update existing entry
      existingEntry.left = (existingEntry.left || 0) + (curr.left || 0);
      existingEntry.right = (existingEntry.right || 0) + (curr.right || 0);
      existingEntry.up = (existingEntry.up || 0) + (curr.up || 0);
      existingEntry.down = (existingEntry.down || 0) + (curr.down || 0);
      existingEntry.mouse_movements = (existingEntry.mouse_movements || 0) + (curr.mouse_movements || 0);
    } else {
      // Add new entry
      acc.push({
        page: formattedPage,
        left: curr.left || 0,
        right: curr.right || 0,
        up: curr.up || 0,
        down: curr.down || 0,
        mouse_movements: curr.mouse_movements || 0
      });
    }
    
    return acc;
  }, [] as typeof data);

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
                data={processedData} 
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