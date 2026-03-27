import { useAuth } from "@/features/auth/useAuth";
import { LibraryBigIcon, UploadCloudIcon } from "lucide-react";
import { Outlet } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../ui/sidebar";

function AppSidebar() {
  const { user } = useAuth();
  console.log("AppLayout render", { user });
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {/* UPLOAD BUTTON */}
            <SidebarMenuItem>
              <SidebarMenuButton>
                <UploadCloudIcon />
                <span>Upload</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* LIBRARY BUTTON */}
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LibraryBigIcon />
                <span>Liberary</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* TODO: Navigate to profile page */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xs bg-primary-container items-center justify-center flex">
            <span className="">{user?.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex flex-col items-start">
            <p className="font-light text-sm">{user?.name}</p>
            <p className="text-xs text-on-surface-variant">{user?.email}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
