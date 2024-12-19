import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CategoryHeaderProps {
  name: string;
  description: string | null;
}

export const CategoryHeader = ({ name, description }: CategoryHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button onClick={() => navigate('/admin/api-manager')}>Create New Page</Button>
    </div>
  );
};