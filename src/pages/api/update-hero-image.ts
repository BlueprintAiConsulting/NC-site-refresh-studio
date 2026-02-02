import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

// API route to update hero image in site-config.json
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { url, alt } = req.body;
  if (!url) return res.status(400).json({ error: "Missing image URL" });

  const configPath = path.join(process.cwd(), "src/content/site-config.json");
  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    config.heroImage = { url, alt: alt || "" };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update config" });
  }
}
