import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import siteConfigRaw from "@/content/site-config.json";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  const [heroImage, setHeroImage] = useState(siteConfigRaw.heroImage.url);
  const [alt, setAlt] = useState(siteConfigRaw.heroImage.alt || "");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      let imageUrl = heroImage;
      if (file) {
        // Upload to Supabase Storage (bucket: 'public')
        const { data, error } = await supabase.storage
          .from("public")
          .upload(`hero/${file.name}`, file, { upsert: true });
        if (error) throw error;
        imageUrl = `/storage/v1/object/public/public/hero/${file.name}`;
      }
      // PATCH site-config.json (requires backend or PR workflow)
      // Here, just show the new URL for manual update
      setHeroImage(imageUrl);
      setMessage("Image uploaded! Please update site-config.json with the new URL:");
    } catch (err: any) {
      setMessage("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 card-church">
      <h2 className="text-2xl font-semibold mb-4">Update Hero Image</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Current Image</label>
          <img src={heroImage} alt={alt} className="rounded-lg w-full max-h-64 object-cover mb-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">New Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Alt Text</label>
          <input
            className="form-input"
            value={alt}
            onChange={e => setAlt(e.target.value)}
            placeholder="Image description for accessibility"
          />
        </div>
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Update Hero Image"}</Button>
        {message && <div className="mt-2 text-sm text-primary font-medium">{message}<br /><span className="break-all">{heroImage}</span></div>}
      </form>
    </div>
  );
}
