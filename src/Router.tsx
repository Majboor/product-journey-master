import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "@/components/ErrorPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Stores } from "@/components/admin/Stores";
import { CreateStore } from "@/components/admin/stores/CreateStore";
import { SingleStore } from "@/components/admin/stores/SingleStore";
import { Root } from "./Root";
import Index from "@/pages/Index";
import Login from "@/pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Index />
      },
      {
        path: "login",
        element: <Login />
      },
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