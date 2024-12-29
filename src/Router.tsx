import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { ErrorPage } from "@/components/ErrorPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Stores } from "@/components/admin/Stores";
import { CreateStore } from "@/components/admin/stores/CreateStore";
import { SingleStore } from "@/components/admin/stores/SingleStore";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "admin",
        element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
        children: [
          {
            path: "stores",
            element: <Stores />
          },
          {
            path: "stores/new",
            element: <CreateStore />
          },
          {
            path: "stores/:storeSlug",
            element: <SingleStore />
          }
        ]
      }
    ]
  }
]);