"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { uploadToCloudinary } from "@/lib/cloudinary";

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
};

type CloudinaryUploadButtonProps = {
  folder?: string;
  label?: string;
  onUploaded?: (result: CloudinaryUploadResult) => void;
};

export default function CloudinaryUploadButton({
  folder = "iron-forge",
  label = "Upload Image",
  onUploaded,
}: CloudinaryUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const result = await uploadToCloudinary(file, folder);
      onUploaded?.(result);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Cloudinary upload failed",
      );
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <Button
        type="button"
        disabled={loading}
        variant="primary"
        onClick={() => inputRef.current?.click()}
        style={{
          padding: "12px 18px",
        }}
      >
        {loading ? "Uploading..." : label}
      </Button>
      {error && (
        <span style={{ color: "#f87171", fontSize: 12, lineHeight: 1.4 }}>
          {error}
        </span>
      )}
    </div>
  );
}
