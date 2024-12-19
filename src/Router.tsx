import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ApiManager from "./pages/ApiManager";
import DynamicPage from "./pages/DynamicPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Dashboard } from "./components/admin/Dashboard";
import { ApiStatus } from "./components/admin/ApiStatus";
import { Pages } from "./components/admin/Pages";
import { Users } from "./components/admin/Users";
import { Categories } from "./components/admin/Categories";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/:categorySlug/:slug" element={<DynamicPage />} />
      
      {/* Protected Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="pages" element={<Pages />} />
        <Route path="categories" element={<Categories />} />
        <Route path="users" element={<Users />} />
        <Route path="api-manager" element={<ApiManager />} />
        <Route path="api-status" element={<ApiStatus />} />
      </Route>
    </Routes>
  );
};