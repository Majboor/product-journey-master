import { createBrowserRouter } from "react-router-dom";
import { ApiManager } from "@/pages/ApiManager";
import { Categories } from "@/components/admin/Categories";
import { SingleCategory } from "@/components/admin/SingleCategory";
import { Stores } from "@/components/admin/Stores";
import { SingleStore } from "@/components/admin/stores/SingleStore";
import { Root } from "./Root";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import DynamicPage from "@/pages/DynamicPage";
import { PaymentSuccess } from "@/pages/PaymentSuccess";
import { PaymentFailed } from "@/pages/PaymentFailed";
import { OrderTracking } from "@/pages/OrderTracking";
import { Sitemap } from "@/pages/Sitemap";

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
        children: [
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
            path: "stores/:storeSlug",
            element: <SingleStore />
          },
          {
            path: "api-manager",
            element: <ApiManager />
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