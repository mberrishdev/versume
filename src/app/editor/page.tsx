import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOctokit, ensureRepo, listCVs, loadCV, saveCV } from "@/lib/github";
import { CVEditor } from "@/components/CVEditor";
import { CVSidebar } from "@/components/CVSidebar";
import { MIKHEIL_CV } from "@/lib/default-cv";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ cv?: string }>;
}) {
  const session = await auth();
  if (!session?.accessToken || !session.githubLogin) redirect("/");

  const octokit = getOctokit(session.accessToken);
  const username = session.githubLogin;
  const { cv: cvParam } = await searchParams;

  await ensureRepo(octokit, username);
  let cvList = await listCVs(octokit, username);

  // Seed default CV if repo is empty
  if (cvList.length === 0) {
    await saveCV(octokit, username, MIKHEIL_CV, "Initial CV import");
    cvList = ["default"];
  }

  const cvName = cvParam || cvList[0] || "default";
  const cv = (await loadCV(octokit, username, cvName)) || MIKHEIL_CV;

  return (
    <div className="flex h-screen overflow-hidden">
      <CVSidebar cvList={cvList} activeCv={cvName} username={username} />
      <div className="flex-1 overflow-hidden">
        <CVEditor initialCV={cv} cvName={cvName} />
      </div>
    </div>
  );
}
