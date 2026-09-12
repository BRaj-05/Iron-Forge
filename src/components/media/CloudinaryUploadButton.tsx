"use client";

import { useRef, useState } from "react";
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
      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        style={{
          border: "1px solid rgba(249,115,22,0.45)",
          background: loading
            ? "rgba(249,115,22,0.12)"
            : "linear-gradient(135deg,#f97316,#ef4444)",
          color: "#fff",
          borderRadius: 12,
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 900,
          padding: "12px 18px",
        }}
      >
        {loading ? "Uploading..." : label}
      </button>
      {error && (
        <span style={{ color: "#f87171", fontSize: 12, lineHeight: 1.4 }}>
          {error}
        </span>
      )}
    </div>
  );
}
