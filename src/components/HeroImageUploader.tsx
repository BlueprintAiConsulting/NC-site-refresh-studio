import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import getCroppedImg from "@/lib/cropImage";

interface HeroImageUploaderProps {
  initialUrl: string;
  onUpload: (url: string) => void;
}

export function HeroImageUploader({ initialUrl, onUpload }: HeroImageUploaderProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialUrl);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const fileName = `hero-${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from("public")
        .upload(`hero/${fileName}`, croppedBlob, { upsert: true, contentType: "image/jpeg" });
      if (error) throw error;
      const url = `/storage/v1/object/public/public/hero/${fileName}`;
      setPreviewUrl(url);
      onUpload(url);
    } catch (err) {
      alert("Upload failed: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Current Hero Image</label>
        <img src={previewUrl} alt="Hero" className="rounded-lg w-full max-h-64 object-cover mb-2" />
      </div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageSrc && (
        <div className="relative w-full h-64 mt-4 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}
      {imageSrc && (
        <Button className="mt-4" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Save Hero Image"}
        </Button>
      )}
    </div>
  );
}
