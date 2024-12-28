import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Users, FileText, Database, LayoutDashboard, Link, FolderOpen, CreditCard, Globe } from "lucide-react";
import { Link as RouterLink, Outlet } from "react-router-dom";

export const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <RouterLink to="/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <RouterLink to="/admin/categories">
                    <FolderOpen />
                    <span>Categories</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <RouterLink to="/admin/pages">
                    <FileText />
                    <span>Pages</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <RouterLink to="/admin/domains">
                    <Globe />
                    <span>Domains</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <RouterLink to="/admin/api-manager">
                    <Database />
                    <span>API Manager</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <RouterLink to="/admin/users">
                    <Users />
                    <span>User Management</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <RouterLink to="/admin/payments">
                    <CreditCard />
                    <span>Payments</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <RouterLink to="/admin/api-status">
                    <Link />
                    <span>API Status</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6">
          <SidebarTrigger className="mb-4" />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};