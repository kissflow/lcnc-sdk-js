import { useState, useEffect } from "react";
import {
  Paperclip,
  X,
  Loader2,
  File,
  FileImage,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileVideo,
  FileAudio
} from "lucide-react";
import { FieldError } from "./FieldError.jsx";
import { FieldLabel } from "./FieldLabel.jsx";

const ATTACHMENT_PICKER_OPTIONS = {
  fileExtensions: ["*"],
  maxSize: 104857600,
  maxCount: 10,
  imageProps: {
    sizes: [
      [1200, 800],
      [100, 100]
    ],
    crop: false
  }
};

const ICONS_BY_EXT = {
  JPG: FileImage,
  JPEG: FileImage,
  PNG: FileImage,
  GIF: FileImage,
  SVG: FileImage,
  PDF: FileText,
  DOC: FileText,
  DOCX: FileText,
  TXT: FileText,
  XLS: FileSpreadsheet,
  XLSX: FileSpreadsheet,
  CSV: FileSpreadsheet,
  ZIP: FileArchive,
  RAR: FileArchive,
  MP4: FileVideo,
  MOV: FileVideo,
  MP3: FileAudio,
  WAV: FileAudio
};

const iconForFile = (file) =>
  ICONS_BY_EXT[(file.fileExtension || "").toUpperCase()] || File;

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export function AttachmentField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  const [files, setFiles] = useState(Array.isArray(value) ? value : []);
  const [picking, setPicking] = useState(false);
  const readOnly = disabled || field.ReadOnly;

  useEffect(() => {
    setFiles(Array.isArray(value) ? value : []);
  }, [value]);

  const handlePick = async () => {
    setPicking(true);
    try {
      const picked = await window.kf.client.openFilePicker(
        ATTACHMENT_PICKER_OPTIONS
      );
      if (picked?.length) {
        const next = [...files, ...picked];
        setFiles(next);
        onChange(next);
        onBlur(next);
      }
    } catch (err) {
      console.error(`Failed to pick attachments for ${field.Name}:`, err);
    } finally {
      setPicking(false);
    }
  };

  const handlePreview = (index) => {
    if (!files.length) return;
    window.kf.client.openFilePreview({ files, indexOfFile: index });
  };

  const handleRemove = (e, key) => {
    e.stopPropagation();
    const next = files.filter((f) => f.key !== key);
    const updated = next.length ? next : null;
    setFiles(next);
    onChange(updated);
    onBlur(updated);
  };

  return (
    <div className="space-y-2">
      <FieldLabel field={field} htmlFor={field.Id} />
      <div
        id={field.Id}
        className="space-y-2 border border-input rounded-lg p-3"
      >
        {files.length > 0 ? (
          files.map((file, index) => {
            const Icon = iconForFile(file);
            return (
              <div
                key={file.key || index}
                onClick={() => handlePreview(index)}
                className="group flex items-center gap-2.5 rounded-md border border-border bg-muted px-3 py-2 cursor-pointer hover:border-input hover:bg-muted transition-colors"
              >
                <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground truncate">
                    {file.name}
                  </p>
                  {file.size != null && (
                    <p className="text-xs text-muted-foreground">
                      {formatSize(file.size)}
                    </p>
                  )}
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, file.key)}
                    className="p-1 rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-destructive hover:bg-background"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">No attachments</p>
        )}
        {!readOnly && (
          <button
            type="button"
            onClick={handlePick}
            disabled={picking}
            className="w-full flex items-center justify-center gap-2 rounded-md border border-dashed border-input bg-muted px-3 py-2 text-sm text-muted-foreground transition-colors cursor-pointer hover:border-input hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {picking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Paperclip className="w-4 h-4" />
            )}
            <span>
              Add attachment
              {ATTACHMENT_PICKER_OPTIONS.maxCount > 1 ? "(s)" : ""}
            </span>
          </button>
        )}
      </div>
      <FieldError error={error} />
    </div>
  );
}
