import "./App.css";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./features/auth/AuthProvider";
import AppRoute from "./routes";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppRoute />
    </AuthProvider>
  );
}

export default App;
