import { Octokit } from "octokit";

export default async function handler(req, res) {
  const { index } = req.body || {};

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

    const existing = JSON.parse(Buffer.from(file.data.content, 'base64').toString('utf8'));

    if (typeof index !== 'number' || index < 0 || index >= existing.length) {
      return res.status(400).send("Invalid index");
    }

    existing.splice(index, 1);

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: repoOwner,
      repo: repoName,
      path: jsonPath,
      message: `Delete entry ${index}`,
      content: Buffer.from(JSON.stringify(existing, null, 2)).toString('base64'),
      sha: file.data.sha
    });

    res.send("Deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting entry");
  }
}
