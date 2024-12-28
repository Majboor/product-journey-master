import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
  title?: string;
  description?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export const ErrorPage = ({ 
  title = "Error Loading Page", 
  description = "There was an error loading the page content.", 
  errors = []
}: ErrorPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <Alert variant="destructive">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="mt-2">
            {description}
            {errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Missing or invalid fields:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>
                      <span className="font-medium">{error.field}:</span> {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
          <Button variant="outline" onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    </div>
  );
};