"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GitFork } from "lucide-react";

export function LoginButton() {
  return (
    <Button size="lg" className="w-full gap-2" onClick={() => signIn("github", { callbackUrl: "/editor" })}>
      <GitFork className="h-5 w-5" />
      Continue with GitHub
    </Button>
  );
}
