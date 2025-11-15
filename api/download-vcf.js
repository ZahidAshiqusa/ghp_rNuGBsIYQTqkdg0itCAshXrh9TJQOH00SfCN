import { Octokit } from "octokit";

export default async function handler(req, res) {
  const { year, month } = req.query;

  const fileName = `vcf/contacts-${year}-${month}.vcf`;

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const repoOwner = process.env.REPO_OWNER || "YOUR_USERNAME";
  const repoName = process.env.REPO_NAME || "YOUR_REPO";

  try {
    const file = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: repoOwner,
      repo: repoName,
      path: fileName
    });

    const vcf = Buffer.from(file.data.content, 'base64').toString('utf8');

    res.setHeader("Content-Type", "text/vcard");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName.split('/')[1]}`);
    res.send(vcf);

  } catch (err) {
    res.status(404).send("No VCF found for this month");
  }
}
