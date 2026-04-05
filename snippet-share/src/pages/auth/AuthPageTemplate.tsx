import { Link } from "react-router";
import { Code2, Share2 } from "lucide-react";

export default function AuthPageTemplate({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "login" | "signup";
}) {
  const isLogin = mode === "login";

  return (
    <div className="grid-cols-2 flex border border-e-primary">
      <BrandingSection />
      <section className="flex md:w-[45%] bg-on-secondary text-white p-20 flex-col justify-between">
        <div className="w-full max-w-md space-y-8">
          <header>
            <h2 className="text-3xl font-bold text-zinc-900">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-zinc-500 mt-2">
              {isLogin
                ? "Enter your credentials to access your snippets."
                : "Sign up to start sharing code snippets."}
            </p>
          </header>
          {children}

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-zinc-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              to={isLogin ? "/signup" : "/login"}
              className="font-bold text-primary-container hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}
const FeatureItem = ({ icon, title, desc }: FeatureItemProps) => (
  <div className="flex gap-4">
    <div className="mt-1">{icon}</div>
    <div>
      <h3 className="font-bold text-lg leading-none">{title}</h3>
      <p className="text-zinc-400 text-sm mt-1">{desc}</p>
    </div>
  </div>
);

function BrandingSection() {
  return (
    <section className="hidden md:flex md:w-[45%] bg-on-background text-white p-20 flex-col justify-between">
      <div>
        <h1 className="text-5xl font-bold leading-tight tracking-tight">
          Share code{" "}
          <span className="text-primary-container">snippets</span>{" "}
          instantly.
        </h1>
        <p className="mt-8 text-xl text-zinc-400 max-w-md">
          The easiest way to share and collaborate on code snippets with your team.
        </p>
      </div>
      <div className="space-y-8">
        <FeatureItem
          icon={<Code2 className="text-primary-container" />}
          title="Syntax Highlighting"
          desc="Support for 100+ programming languages."
        />
        <FeatureItem
          icon={<Share2 className="text-primary-container" />}
          title="Easy Sharing"
          desc="Share snippets via short URLs instantly."
        />
      </div>
    </section>
  );
}
