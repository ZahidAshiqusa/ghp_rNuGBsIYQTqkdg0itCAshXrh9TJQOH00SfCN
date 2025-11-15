import { Octokit } from "octokit";

export default async function handler(req, res) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const repoOwner = process.env.REPO_OWNER || "YOUR_USERNAME";
  const repoName = process.env.REPO_NAME || "YOUR_REPO";
  const jsonPath = "data/records.json";

  try {
    const file = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: repoOwner,
      repo: repoName,
      path: jsonPath
    });

    const records = JSON.parse(Buffer.from(file.data.content, 'base64').toString('utf8'));
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
}
