import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOctokit, ensureRepo, listCVs, loadCV } from "@/lib/github";
import { CVEditor } from "@/components/CVEditor";
import { CVSidebar } from "@/components/CVSidebar";
import { MIKHEIL_CV } from "@/lib/default-cv";

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ cv?: string }> }) {
  const session = await auth();
  if (!session?.accessToken || !session.githubLogin) redirect("/");

  const octokit = getOctokit(session.accessToken);
  const username = session.githubLogin;
  const { cv: cvParam } = await searchParams;

  await ensureRepo(octokit, username);
  const cvList = await listCVs(octokit, username);

  if (cvList.length === 0) redirect("/onboarding");

  const cvName = cvParam || cvList[0] || "default";
  const cv = (await loadCV(octokit, username, cvName)) || MIKHEIL_CV;

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--v-bg-0)", overflow: "hidden" }}>
      <CVSidebar cvList={cvList} activeCv={cvName} username={username} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <CVEditor initialCV={cv} cvName={cvName} />
      </div>
    </div>
  );
}
