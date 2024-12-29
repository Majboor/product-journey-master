import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Users, FileText, Database, LayoutDashboard, Link, Store, CreditCard, Globe, ChevronDown, ChevronRight } from "lucide-react";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const managementItems = [
    {
      title: "Pages",
      icon: FileText,
      path: "/admin/pages"
    },
    {
      title: "Domains",
      icon: Globe,
      path: "/admin/domains"
    },
    {
      title: "API Manager",
      icon: Database,
      path: "/admin/api-manager"
    },
    {
      title: "User Management",
      icon: Users,
      path: "/admin/users"
    },
    {
      title: "Payments",
      icon: CreditCard,
      path: "/admin/payments"
    },
    {
      title: "API Status",
      icon: Link,
      path: "/admin/api-status"
    }
  ];

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
                  <RouterLink to="/admin/stores">
                    <Store />
                    <span>Stores</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2 px-2 hover:bg-accent hover:text-accent-foreground"
                    >
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <span>Management</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56" 
                    side="right"
                    align="start"
                    alignOffset={-40}
                  >
                    {managementItems.map((item) => (
                      <DropdownMenuItem key={item.title} asChild>
                        <RouterLink 
                          to={item.path}
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </RouterLink>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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