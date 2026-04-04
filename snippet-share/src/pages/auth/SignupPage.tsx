import { useAuth } from "@/features/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import AuthPageTemplate from "./AuthPageTemplate";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const success = await signup(name, email, password);
    setLoading(false);
    if (success) {
      toast.success("Account created!");
      navigate("/");
    } else {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <AuthPageTemplate mode="signup">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Full Name
          </label>
          <Input
            type="text"
            placeholder="Jane Doe"
            className="h-12 bg-zinc-50 border-zinc-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="archivist@institution.org"
            className="h-12 bg-zinc-50 border-zinc-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Password
          </label>
          <Input
            type="password"
            placeholder="At least 6 characters"
            className="h-12 bg-zinc-50 border-zinc-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center w-full h-14 bg-primary-container hover:bg-primary-container/90 text-lg font-bold"
        >
          {loading ? "Creating account..." : "Create Account"} <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </AuthPageTemplate>
  );
}
