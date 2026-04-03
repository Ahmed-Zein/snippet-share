import { useAuth } from "@/features/auth/useAuth";
import { LibraryBigIcon, LogOut, User, UserCircle } from "lucide-react";
import { NavLink, Outlet } from "react-router";
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

const navItems = [
  { title: "Liberary", url: "/", icon: LibraryBigIcon },
  { title: "Upload", url: "/profile", icon: User },
];
function AppSidebar() {
  const { user } = useAuth();
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Snippet-Share</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <NavLink
                to={item.url}
                key={item.url}
                className={({ isActive }) => (isActive ? "bg-primary/10" : "")}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </NavLink>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
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
