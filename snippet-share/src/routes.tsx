import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { AppLayout } from "./components/layouts/AppLayout";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { useAuth } from "./features/auth/useAuth";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { ProfilePage } from "./pages/ProfilePage";
import UploadPage from "./pages/UploadPage";
import FileViewerPage from "./pages/public/FileViewerPage";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (no auth) */}
        <Route path="/s/:shortUrl" element={<FileViewerPage />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<ProfilePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
