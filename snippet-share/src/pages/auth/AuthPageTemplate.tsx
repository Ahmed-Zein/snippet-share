import { Search, Shield } from "lucide-react";

export default function AuthPageTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid-cols-2 flex  border border-e-primary">
      <BrandingSection />
      <section className="flex md:w-[45%] bg-on-secondary text-white p-20 flex-col justify-between">
        <div className="w-full max-w-md space-y-8">
          <header>
            <h2 className="text-3xl font-bold text-zinc-900">
              Access the Archives
            </h2>
            <p className="text-zinc-500 mt-2">
              Enter your credentials to manage your collection.
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
            New archivist?{" "}
            <button className="font-bold text-primary-container">
              Sign up
            </button>
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
          Preserving the{" "}
          <span className="text-primary-container">intellectual capital</span>{" "}
          of the next generation.
        </h1>
        <p className="mt-8 text-xl text-zinc-400 max-w-md">
          A high-fidelity archival system designed for technical teams,
          researchers, and digital historians.
        </p>
      </div>
      <div className="space-y-8">
        <FeatureItem
          icon={<Shield className="text-primary-container" />}
          title="Immutable Storage"
          desc="Content-addressed hashing ensures data integrity."
        />
        <FeatureItem
          icon={<Search className="text-primary-container" />}
          title="Semantic Retrieval"
          desc="Natural language search across all document types."
        />
      </div>
    </section>
  );
}
