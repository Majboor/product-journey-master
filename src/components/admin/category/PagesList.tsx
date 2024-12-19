import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileEdit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PagesListProps {
  pages: Array<{
    id: string;
    slug: string;
    content: any;
  }>;
}

export const PagesList = ({ pages }: PagesListProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pages in Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {pages?.map((page) => (
              <Card key={page.id} className="w-[300px] flex-shrink-0">
                <CardHeader>
                  <CardTitle className="text-lg">{page.slug}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium">Page Content</div>
                      <p className="text-sm text-muted-foreground truncate">
                        {JSON.stringify(page.content).slice(0, 50)}...
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/admin/api-manager?edit=${page.slug}`)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {}}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};