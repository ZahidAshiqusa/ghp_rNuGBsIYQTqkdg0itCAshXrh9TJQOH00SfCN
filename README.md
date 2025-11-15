# Ali Institute Registration

## Setup (Vercel)
1. Create a GitHub repo and push this project.
2. On Vercel dashboard, import the GitHub repo.
3. Set Environment Variables in Vercel:
   - GITHUB_TOKEN = (a Personal Access Token with repo access)
   - REPO_OWNER = your-github-username
   - REPO_NAME = your-repo-name
   - ADMIN_PASSWORD = choose-a-strong-password

## Notes
- The API endpoints use GitHub to store data in `data/records.json` and monthly VCF files under `vcf/`.
- Make sure the GITHUB_TOKEN has `repo` permission to read/write files.
- To test locally, use `vercel dev` and set env vars locally.

