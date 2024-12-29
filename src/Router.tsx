import { createBrowserRouter } from "react-router-dom";
import ApiManager from "@/pages/ApiManager";
import { Categories } from "@/components/admin/Categories";
import { SingleCategory } from "@/components/admin/SingleCategory";
import { Stores } from "@/components/admin/Stores";
import { SingleStore } from "@/components/admin/stores/SingleStore";
import { CreateStore } from "@/components/admin/stores/CreateStore";
import { Root } from "./Root";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import DynamicPage from "@/pages/DynamicPage";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentFailed from "@/pages/PaymentFailed";
import OrderTracking from "@/pages/OrderTracking";
import Sitemap from "@/pages/Sitemap";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Dashboard } from "@/components/admin/Dashboard";
import { Users } from "@/components/admin/Users";
import { Pages } from "@/components/admin/Pages";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
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
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: <Dashboard />
          },
          {
            path: "pages",
            element: <Pages />
          },
          {
            path: "categories",
            element: <Categories />
          },
          {
            path: "categories/:categorySlug",
            element: <SingleCategory />
          },
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
          },
          {
            path: "api-manager",
            element: <ApiManager />
          },
          {
            path: "users",
            element: <Users />
          }
        ]
      },
      {
        path: "payment/success",
        element: <PaymentSuccess />
      },
      {
        path: "payment/failed",
        element: <PaymentFailed />
      },
      {
        path: "order/:orderId",
        element: <OrderTracking />
      },
      {
        path: "sitemap.xml",
        element: <Sitemap />
      },
      {
        path: "*",
        element: <DynamicPage />
      }
    ]
  }
]);