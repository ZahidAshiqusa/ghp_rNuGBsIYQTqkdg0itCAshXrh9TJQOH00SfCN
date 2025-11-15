export default function handler(req, res) {
  const { password } = req.body || {};
  if (password === process.env.ADMIN_PASSWORD) res.send("OK");
  else res.send("NO");
}
