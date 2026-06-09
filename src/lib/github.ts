import { Octokit } from "@octokit/rest";
import { CV } from "@/types/cv";

const REPO_NAME = "cv-store";
const REPO_DESCRIPTION = "My CV data managed by Versume";

export function getOctokit(accessToken: string) {
  return new Octokit({ auth: accessToken });
}

async function safeGetContent(
  octokit: Octokit,
  owner: string,
  path: string,
  ref?: string
) {
  return octokit.repos
    .getContent({ owner, repo: REPO_NAME, path, ...(ref ? { ref } : {}) })
    .catch(() => null);
}

export async function ensureRepo(octokit: Octokit, username: string) {
  const exists = await octokit.repos
    .get({ owner: username, repo: REPO_NAME })
    .catch(() => null);

  if (!exists) {
    await octokit.repos.createForAuthenticatedUser({
      name: REPO_NAME,
      description: REPO_DESCRIPTION,
      private: true,
      auto_init: true,
    });
    await new Promise((r) => setTimeout(r, 2000));
  }
}

export async function listCVs(
  octokit: Octokit,
  username: string
): Promise<string[]> {
  const res = await safeGetContent(octokit, username, "cvs");
  if (!res) return [];
  const { data } = res;
  if (!Array.isArray(data)) return [];
  return data
    .filter((f) => f.name.endsWith(".json"))
    .map((f) => f.name.replace(".json", ""));
}

export async function loadCV(
  octokit: Octokit,
  username: string,
  cvName: string
): Promise<CV | null> {
  const res = await safeGetContent(octokit, username, `cvs/${cvName}.json`);
  if (!res) return null;
  const { data } = res;
  if (!("content" in data)) return null;
  return JSON.parse(Buffer.from(data.content, "base64").toString("utf-8")) as CV;
}

export async function saveCV(
  octokit: Octokit,
  username: string,
  cv: CV,
  message?: string
): Promise<void> {
  const path = `cvs/${cv.meta.name}.json`;
  const content = Buffer.from(JSON.stringify(cv, null, 2)).toString("base64");
  const commitMessage = message || `Update ${cv.meta.name} - ${new Date().toISOString()}`;

  const existing = await safeGetContent(octokit, username, path);
  const sha =
    existing && "sha" in existing.data ? (existing.data as { sha: string }).sha : undefined;

  await octokit.repos.createOrUpdateFileContents({
    owner: username,
    repo: REPO_NAME,
    path,
    message: commitMessage,
    content,
    ...(sha ? { sha } : {}),
  });
}

export async function deleteCV(
  octokit: Octokit,
  username: string,
  cvName: string
): Promise<void> {
  const res = await safeGetContent(octokit, username, `cvs/${cvName}.json`);
  if (!res) return;
  const { data } = res;
  if (!("sha" in data)) return;
  await octokit.repos.deleteFile({
    owner: username,
    repo: REPO_NAME,
    path: `cvs/${cvName}.json`,
    message: `Delete ${cvName}`,
    sha: data.sha,
  });
}

export async function getVersionHistory(
  octokit: Octokit,
  username: string,
  cvName: string
): Promise<{ sha: string; message: string; date: string; author: string }[]> {
  const res = await octokit.repos
    .listCommits({
      owner: username,
      repo: REPO_NAME,
      path: `cvs/${cvName}.json`,
      per_page: 20,
    })
    .catch(() => null);

  if (!res) return [];
  return res.data.map((c) => ({
    sha: c.sha,
    message: c.commit.message,
    date: c.commit.author?.date || "",
    author: c.commit.author?.name || "",
  }));
}

export async function loadCVAtCommit(
  octokit: Octokit,
  username: string,
  cvName: string,
  sha: string
): Promise<CV | null> {
  const res = await safeGetContent(octokit, username, `cvs/${cvName}.json`, sha);
  if (!res) return null;
  const { data } = res;
  if (!("content" in data)) return null;
  return JSON.parse(Buffer.from(data.content, "base64").toString("utf-8")) as CV;
}
