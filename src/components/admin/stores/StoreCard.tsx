import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, ChevronRight, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface StoreCardProps {
  store: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  };
  analytics: Array<{
    date: string;
    visits: number;
  }>;
  onClick: () => void;
  onDelete: () => React.ReactNode;
}

export const StoreCard = ({ store, analytics, onClick, onDelete }: StoreCardProps) => {
  const deleteDialog = onDelete();

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          <CardTitle className="text-xl font-medium">
            {store.name}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            {deleteDialog}
          </AlertDialog>
          <Button variant="ghost" size="icon" onClick={onClick}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{store.description}</p>
          
          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};