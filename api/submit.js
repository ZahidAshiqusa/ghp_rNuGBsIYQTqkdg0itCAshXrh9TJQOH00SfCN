import { Octokit } from "octokit";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  const data = req.body;

  // GitHub Setup
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const repoOwner = process.env.REPO_OWNER || "YOUR_USERNAME"; // set in env
  const repoName = process.env.REPO_NAME || "YOUR_REPO";      // set in env
  const jsonPath = "data/records.json";

  // Monthly VCF file
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const vcfPath = `vcf/contacts-${year}-${month}.vcf`;

  try {
    // --- Load existing JSON file ---
    const file = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: repoOwner,
      repo: repoName,
      path: jsonPath
    });

    const existing = JSON.parse(Buffer.from(file.data.content, 'base64').toString('utf8'));
    existing.push(data);

    // --- Update records.json on GitHub ---
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: repoOwner,
      repo: repoName,
      path: jsonPath,
      message: `New Entry - ${data.name}`,
      content: Buffer.from(JSON.stringify(existing, null, 2)).toString('base64'),
      sha: file.data.sha
    });

    // --- Prepare vCard for this entry ---
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTEL:${data.phone}\nNOTE:ChildCount=${data.childCount};Class=${data.class};Gender=${data.gender};Address=${data.address};Interest=${data.interest};Surveyor=${data.surveyor}\nEND:VCARD\n`;

    // --- Try to fetch existing monthly VCF file ---
    let vcfSha = null;
    let currentVcf = "";
    try {
      const vcfFile = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: repoOwner,
        repo: repoName,
        path: vcfPath
      });
      vcfSha = vcfFile.data.sha;
      currentVcf = Buffer.from(vcfFile.data.content, 'base64').toString('utf8');
    } catch (err) {
      // If 404, we'll create the file; otherwise rethrow
      if (err.status && err.status !== 404) throw err;
    }

    const newVcfContent = currentVcf + vcard;

    // --- Update or create contacts.vcf on GitHub ---
    const putParams = {
      owner: repoOwner,
      repo: repoName,
      path: vcfPath,
      message: `Update contacts.vcf - ${data.name}`,
      content: Buffer.from(newVcfContent).toString('base64')
    };
    if (vcfSha) putParams.sha = vcfSha;

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', putParams);

    res.status(200).send("Data saved successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving data.");
  }
}
