import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOctokit, getVersionHistory, loadCVAtCommit } from "@/lib/github";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.accessToken || !session.githubLogin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const octokit = getOctokit(session.accessToken);
  const username = session.githubLogin;
  const { searchParams } = new URL(req.url);
  const cvName = searchParams.get("name");
  const sha = searchParams.get("sha");

  if (!cvName) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  if (sha) {
    const cv = await loadCVAtCommit(octokit, username, cvName, sha);
    if (!cv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(cv);
  }

  const history = await getVersionHistory(octokit, username, cvName);
  return NextResponse.json({ history });
}
