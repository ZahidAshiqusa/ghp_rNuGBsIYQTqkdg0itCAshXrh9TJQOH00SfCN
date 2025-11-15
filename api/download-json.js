import { Octokit } from "octokit";

export default async function handler(req, res) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const repoOwner = process.env.REPO_OWNER || "YOUR_USERNAME";
  const repoName = process.env.REPO_NAME || "YOUR_REPO";

  try {
    const file = await octokit.request('GET /repos/{owner}/{repo}/contents/data/records.json', {
      owner: repoOwner,
      repo: repoName
    });

    const json = Buffer.from(file.data.content, 'base64').toString('utf8');

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=records.json");
    res.send(json);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching JSON");
  }
}
