import { BrowserRouter, Route, Routes } from "react-router";
import { AuthLayout } from "./components/layouts/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/auth/SignupPage";
import { AppLayout } from "./components/layouts/AppLayout";

export default function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
