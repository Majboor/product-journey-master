import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentPagesProps {
  pages: Array<{
    id: string;
    slug: string;
    created_at: string;
  }>;
}

export const RecentPages = ({ pages }: RecentPagesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {pages?.slice(0, 5).map((page) => (
            <div key={page.id} className="flex items-center justify-between">
              <span>{page.slug}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(page.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};