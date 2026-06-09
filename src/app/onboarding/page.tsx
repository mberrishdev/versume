import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/OnboardingFlow";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.githubLogin) redirect("/");
  return <OnboardingFlow username={session.githubLogin} />;
}
