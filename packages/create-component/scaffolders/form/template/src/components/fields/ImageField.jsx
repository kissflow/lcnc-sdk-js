import { useState, useEffect } from "react";
import { ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { FieldError } from "./FieldError.jsx";
import { FieldLabel } from "./FieldLabel.jsx";

const IMAGE_PICKER_OPTIONS = {
  fileExtensions: ["JPG", "JPEG", "BMP", "PNG"],
  maxSize: 104857600,
  maxCount: 1,
  imageProps: {
    sizes: [
      [1200, 800],
      [300, 300]
    ],
    crop: false
  }
};

export function ImageField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [picking, setPicking] = useState(false);
  const readOnly = disabled || field.ReadOnly;

  useEffect(() => {
    let cancelled = false;

    const resolvePreview = async () => {
      if (!value?.key) {
        setPreviewUrl(null);
        return;
      }
      setResolving(true);
      try {
        const dataUrl = await window.kf.client.getImageUrl(value);
        if (!cancelled) setPreviewUrl(dataUrl);
      } catch (err) {
        console.error(`Failed to resolve image for ${field.Name}:`, err);
        if (!cancelled) setPreviewUrl(null);
      } finally {
        if (!cancelled) setResolving(false);
      }
    };

    resolvePreview();
    return () => {
      cancelled = true;
    };
  }, [value?.key]);

  const handlePick = async () => {
    setPicking(true);
    try {
      const files = await window.kf.client.openFilePicker(IMAGE_PICKER_OPTIONS);
      const file = files?.[0];
      if (file) {
        onChange(file);
        onBlur(file);
      }
    } catch (err) {
      console.error(`Failed to pick image for ${field.Name}:`, err);
    } finally {
      setPicking(false);
    }
  };

  const handlePreview = () => {
    if (!value) return;
    window.kf.client.openFilePreview({ files: [value] });
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    onBlur(null);
  };

  return (
    <div className="space-y-2">
      <FieldLabel field={field} htmlFor={field.Id} />
      {value?.key ? (
        <div
          id={field.Id}
          className="relative group w-40 h-40 rounded-lg border border-border overflow-hidden bg-muted cursor-pointer"
          onClick={handlePreview}
        >
          {resolving && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {!resolving && previewUrl && (
            <img
              src={previewUrl}
              alt={value.name || field.Name}
              className="w-full h-full object-cover"
            />
          )}
          {!readOnly && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-background/90 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-destructive hover:bg-background"
              aria-label={`Remove ${field.Name}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : readOnly ? (
        <div
          id={field.Id}
          className="w-40 h-40 rounded-lg border border-dashed border-border bg-muted flex items-center justify-center text-muted-foreground"
        >
          <ImageIcon className="w-8 h-8" />
        </div>
      ) : (
        <button
          id={field.Id}
          type="button"
          onClick={handlePick}
          disabled={picking}
          className={`w-40 h-40 rounded-lg border border-dashed flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground transition-colors cursor-pointer hover:border-input hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 ${
            error
              ? "border-destructive/50 bg-destructive/10"
              : "border-input bg-muted"
          }`}
        >
          {picking ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Upload className="w-6 h-6" />
              <span>Upload image</span>
            </>
          )}
        </button>
      )}
      <FieldError error={error} />
    </div>
  );
}
