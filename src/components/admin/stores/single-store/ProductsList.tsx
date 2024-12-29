import { Card } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface ProductsListProps {
  storeId: string;
  pages: Tables<"pages">[];
}

export const ProductsList = ({ storeId, pages }: ProductsListProps) => {
  return (
    <div className="grid gap-4">
      {pages.map((page) => (
        <Card key={page.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                {(page.content as any)?.product?.details?.title || 'Untitled Product'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {page.slug}
              </p>
            </div>
            <div className="text-lg font-semibold">
              ${(page.content as any)?.product?.details?.price || 0}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};