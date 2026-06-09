import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { loadCV, getOctokit } from "@/lib/github";
import { PrintClient } from "./PrintClient";

export default async function PrintPage({ searchParams }: { searchParams: Promise<{ cv?: string }> }) {
  const session = await auth();
  if (!session?.githubLogin) redirect("/");

  const { cv: cvName } = await searchParams;
  if (!cvName) redirect("/editor");

  const octokit = getOctokit(session.accessToken!);
  const cv = await loadCV(octokit, session.githubLogin, cvName);
  if (!cv) redirect("/editor");

  return <PrintClient cv={cv} />;
}
