import { ArrowLeft } from "lucide-react";
import { Link, Outlet } from "react-router";
export default function SimpleLayout() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-base font-bold text-zinc-900 tracking-tight"
          >
            Snippet Share
          </Link>
          <Link
            to="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
