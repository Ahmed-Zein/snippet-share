import "./App.css";
import { AuthProvider } from "./features/auth/AuthProvider";
import AppRoute from "./routes";

function App() {
  return (
    <AuthProvider>
      <AppRoute />
    </AuthProvider>
  );
}

export default App;
