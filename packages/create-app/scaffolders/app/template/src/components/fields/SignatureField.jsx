import { useState, useEffect, useRef } from "react";
import { Loader2, PenLine, Upload, X } from "lucide-react";

const SIGNATURE_PICKER_OPTIONS = {
  fileExtensions: ["JPG", "JPEG", "PNG"],
  maxSize: 10485760,
  maxCount: 1,
  imageProps: {
    sizes: [
      [1200, 800],
      [300, 300]
    ],
    crop: false
  }
};

function resolveSignatureUrl(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value.key && window.kf?.client?.getImageUrl)
    return window.kf.client.getImageUrl(value);
  return null;
}

export function SignatureField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("draw");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [picking, setPicking] = useState(false);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const readOnly = disabled || field?.ReadOnly;

  const valueKey = typeof value === "string" ? value : value?.key;

  useEffect(
    function resolvePreview() {
      let cancelled = false;
      const resolve = async () => {
        if (!value) {
          setPreviewUrl(null);
          return;
        }
        setResolving(true);
        try {
          const url = await Promise.resolve(resolveSignatureUrl(value));
          if (!cancelled) setPreviewUrl(url);
        } catch {
          if (!cancelled) setPreviewUrl(null);
        } finally {
          if (!cancelled) setResolving(false);
        }
      };
      resolve();
      return function cleanup() {
        cancelled = true;
      };
    },
    [valueKey]
  );

  useEffect(
    function initCanvas() {
      if (!isEditing || activeTab !== "draw" || !canvasRef.current) return;
      const canvas = canvasRef.current;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#263045";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (previewUrl) {
        const img = new Image();
        img.onload = () =>
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        img.src = previewUrl;
      }
    },
    [isEditing, activeTab]
  );

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveDraw = async () => {
    setSaving(true);
    try {
      const blob = await new Promise((resolve) =>
        canvasRef.current.toBlob(resolve, "image/png")
      );
      const file = new File([blob], "signature.png", { type: "image/png" });
      const result = await window.kf.client.uploadFile(file);
      if (result) {
        onChange(result);
        onBlur(result);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Signature draw upload failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async () => {
    setPicking(true);
    try {
      const files = await window.kf.client.openFilePicker(
        SIGNATURE_PICKER_OPTIONS
      );
      const file = files?.[0];
      if (file) {
        onChange(file);
        onBlur(file);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Signature upload failed:", err);
    } finally {
      setPicking(false);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    onBlur(null);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={field.Id}
        className="block text-sm font-semibold text-foreground"
      >
        {field.Name}
        {field.Required && <span className="text-destructive ml-1">*</span>}
      </label>

      {/* Display */}
      {!isEditing && (
        <>
          {value ? (
            <div
              className={`relative group rounded-lg border overflow-hidden bg-muted ${
                error ? "border-destructive/50" : "border-border"
              }`}
              style={{ height: "80px", maxWidth: "300px" }}
            >
              {resolving && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {!resolving && previewUrl && (
                <img
                  src={previewUrl}
                  alt={`${field.Name} signature`}
                  className="w-full h-full object-contain p-2"
                />
              )}
              {!readOnly && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-2 py-1 text-xs font-medium text-primary border border-primary/40 rounded hover:bg-primary/10"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-1 text-muted-foreground border border-border rounded hover:text-destructive hover:border-destructive/40"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : readOnly ? (
            <div
              className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted text-muted-foreground text-sm"
              style={{ height: "80px", maxWidth: "300px" }}
            >
              No signature
            </div>
          ) : (
            <button
              id={field.Id}
              type="button"
              onClick={() => setIsEditing(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed text-sm text-muted-foreground hover:border-input hover:text-foreground transition-colors ${
                error
                  ? "border-destructive/50 bg-destructive/10"
                  : "border-input bg-muted"
              }`}
            >
              <PenLine className="w-4 h-4" />
              Add signature
            </button>
          )}
        </>
      )}

      {/* Inline editor */}
      {isEditing && (
        <div className="rounded-lg border border-border overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border bg-muted">
            {["draw", "upload"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-ring text-primary bg-background"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "draw" ? "Draw" : "Upload"}
              </button>
            ))}
          </div>

          {activeTab === "draw" ? (
            <div className="p-3 space-y-2 bg-background">
              <canvas
                ref={canvasRef}
                className="w-full rounded border border-border bg-background cursor-crosshair touch-none"
                style={{ height: "160px", display: "block" }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  Clear
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDraw}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-background flex flex-col items-center gap-3 py-6">
              <p className="text-sm text-muted-foreground">
                Upload a JPG or PNG image of your signature
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-md hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={picking}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium border border-input rounded-md hover:bg-muted disabled:opacity-50"
                >
                  {picking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Choose image
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && !isEditing && (
        <p className="text-sm text-destructive">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}
