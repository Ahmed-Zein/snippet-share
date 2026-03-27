import { Button } from "@base-ui/react";
import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface-container text-on-surface flex flex-col">
      <nav className="sticky top-0 z-50 w-full p-4 bg-surface flex items-center justify-between">
        <div className="text-on-surface font-bold text-xl tracking-tight">
          Snippet Share
        </div>
        <Button className="text-on-surface hover:after:bg-white/10 relative overflow-hidden rounded-full px-6 py-2 font-medium transition-all">
          Login
        </Button>
      </nav>

      <main className="flex-1 bg-surface-dim flex flex-col justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-7xl mx-auto h-full flex justify-center items-center">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
