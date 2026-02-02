import { useState } from "react";
import siteConfigRaw from "@/content/site-config.json";
import { HeroImageUploader } from "@/components/HeroImageUploader";

export default function AdminSettings() {
  const [message, setMessage] = useState("");
  const [alt, setAlt] = useState(siteConfigRaw.heroImage.alt || "");

  const handleHeroImageUpload = async (url: string) => {
    setMessage("Updating hero image...");
    try {
      const res = await fetch("/api/update-hero-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt }),
      });
      if (!res.ok) throw new Error("Failed to update site-config.json");
      setMessage("Hero image updated successfully!");
    } catch (err: any) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 card-church">
      <h2 className="text-2xl font-semibold mb-4">Update Hero Image</h2>
      <HeroImageUploader initialUrl={siteConfigRaw.heroImage.url} onUpload={handleHeroImageUpload} />
      <div className="mt-4">
        <label className="block mb-1 font-medium">Alt Text</label>
        <input
          className="form-input"
          value={alt}
          onChange={e => setAlt(e.target.value)}
          placeholder="Image description for accessibility"
        />
      </div>
      {message && <div className="mt-4 text-primary font-medium">{message}</div>}
    </div>
  );
}
