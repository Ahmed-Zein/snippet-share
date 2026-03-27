import { useAuth } from "@/features/auth/useAuth";
import { Button, Input } from "@base-ui/react";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import AuthPageTemplate from "./AuthPageTemplate";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await login(email, password);
    if (res) {
      navigate("/");
    } else {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <AuthPageTemplate>
      <form className="space-y-6">
        <div className="flex flex-col gap-2 justify-between items-start">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="archivist@institution.org"
            className="h-12 bg-zinc-50 border-zinc-200 p-2 w-full "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex flex-col gap-2 justify-between items-start">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Password
            </label>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            className="h-12 bg-zinc-50 border-zinc-200 p-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          onClick={async () => {
            await handleLogin();
          }}
          className="flex items-center  justify-center w-full h-14 bg-primary-container hover:bg-primary-container text-lg font-bold"
        >
          Login <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </AuthPageTemplate>
  );
}
