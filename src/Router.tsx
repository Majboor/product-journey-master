import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import DynamicPage from "@/pages/DynamicPage";
import ApiManager from "@/pages/ApiManager";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentFailed from "@/pages/PaymentFailed";
import OrderTracking from "@/pages/OrderTracking";
import Sitemap from "@/pages/Sitemap";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Dashboard } from "@/components/admin/Dashboard";
import { Categories } from "@/components/admin/Categories";
import { SingleCategory } from "@/components/admin/SingleCategory";
import { Pages } from "@/components/admin/Pages";
import { Users } from "@/components/admin/Users";
import { ApiStatus } from "@/components/admin/ApiStatus";
import { Payments } from "@/components/admin/Payments";
import { Domains } from "@/components/admin/Domains";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/about",
        element: <DynamicPage />,
      },
      {
        path: "/features",
        element: <DynamicPage />,
      },
      {
        path: "/why-us",
        element: <DynamicPage />,
      },
      {
        path: "/reviews",
        element: <DynamicPage />,
      },
      {
        path: "/general",
        element: <DynamicPage />,
      },
      {
        path: "/payment/success",
        element: <PaymentSuccess />,
      },
      {
        path: "/payment/failed",
        element: <PaymentFailed />,
      },
      {
        path: "/order-tracking/:orderId",
        element: <OrderTracking />,
      },
      {
        path: "/:categorySlug/sitemap.xml",
        element: <Sitemap />,
      },
      {
        path: "/:categorySlug/:slug",
        element: <DynamicPage />,
      },
    ]
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
        path: "payments",
        element: <Payments />,
      },
      {
        path: "api-status",
        element: <ApiStatus />,
      },
      {
        path: "api-manager",
        element: <ApiManager />,
      },
      {
        path: "domains",
        element: <Domains />,
      },
    ],
  },
]);