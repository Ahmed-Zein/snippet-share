import { useAuth } from "@/features/auth/useAuth";
import {
  LibraryBigIcon,
  LogOut,
  UploadCloudIcon,
  UserCircle,
} from "lucide-react";
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
  const { logout } = useAuth();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 justify-center items-start overflow-y-auto bg-surface-bright p-18">
        <nav className="flex text-on-surface-variant  justify-end gap-x-12 m-0 pb-8">
          <UserCircle />
          <LogOut
            className="hover:text-on-surface cursor-pointer"
            onClick={logout}
          />
        </nav>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
