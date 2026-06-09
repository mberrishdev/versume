import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOctokit, ensureRepo, listCVs, loadCV, saveCV, deleteCV } from "@/lib/github";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.accessToken || !session.githubLogin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const octokit = getOctokit(session.accessToken);
  const username = session.githubLogin!;
  const { searchParams } = new URL(req.url);
  const cvName = searchParams.get("name");

  await ensureRepo(octokit, username);

  if (cvName) {
    const cv = await loadCV(octokit, username, cvName);
    if (!cv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(cv);
  }

  const cvs = await listCVs(octokit, username);
  return NextResponse.json({ cvs });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.accessToken || !session.githubLogin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const octokit = getOctokit(session.accessToken);
  const username = session.githubLogin!;
  const { cv, message } = await req.json();

  await ensureRepo(octokit, username);
  await saveCV(octokit, username, cv, message);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.accessToken || !session.githubLogin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const octokit = getOctokit(session.accessToken);
  const username = session.githubLogin!;
  const { searchParams } = new URL(req.url);
  const cvName = searchParams.get("name");
  if (!cvName) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  await deleteCV(octokit, username, cvName);
  return NextResponse.json({ success: true });
}
