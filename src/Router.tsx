import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import DynamicPage from "@/pages/DynamicPage";
import ApiManager from "@/pages/ApiManager";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Dashboard } from "@/components/admin/Dashboard";
import { Categories } from "@/components/admin/Categories";
import { SingleCategory } from "@/components/admin/SingleCategory";
import { Pages } from "@/components/admin/Pages";
import { Users } from "@/components/admin/Users";
import { ApiStatus } from "@/components/admin/ApiStatus";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/:categorySlug/:slug",
    element: <DynamicPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "categories/:slug",
        element: <SingleCategory />,
      },
      {
        path: "pages",
        element: <Pages />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "api-status",
        element: <ApiStatus />,
      },
      {
        path: "api-manager",
        element: <ApiManager />,
      },
    ],
  },
]);