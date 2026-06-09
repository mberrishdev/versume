import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/LoginButton";
import { GitFork, FileText, GitBranch, Layers } from "lucide-react";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/editor");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Versume</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Version your resume like code. Every save is a git commit in your
            private GitHub repo — full history, multiple variants.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <Feature icon={<GitFork className="h-5 w-5" />} label="GitHub backed" />
          <Feature icon={<GitBranch className="h-5 w-5" />} label="Version history" />
          <Feature icon={<Layers className="h-5 w-5" />} label="Multiple CVs" />
        </div>

        <LoginButton />

        <p className="text-xs text-muted-foreground">
          Requires <code>repo</code> scope to create your private{" "}
          <code>cv-store</code> repository.
        </p>
      </div>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/50">
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
