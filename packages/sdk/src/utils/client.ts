import { BaseSDK, LISTENER_CMDS } from "../core";
import type { FilePickerOptions, UploadableFile } from "../types/internal";

export class Client extends BaseSDK {
    /**
     * Display an info message toast in the platform.
     *
     * @param message - The message to display. Accepts a string or object (serialized to JSON).
     * @returns A promise that resolves when the message is shown.
     *
     * @example
     * await kf.client.showInfo("Record saved successfully");
     */
    showInfo(message: string | object) {
        return super._postMessageAsync(LISTENER_CMDS.MESSAGE, { message });
    }

    /**
     * Display a confirmation dialog and wait for the user's response.
     *
     * @param args - Dialog configuration.
     * @param args.title - Dialog title.
     * @param args.content - Body text of the dialog.
     * @param args.okText - Label for the confirm button (default: "Ok").
     * @param args.cancelText - Label for the cancel button (default: "Cancel").
     * @returns A promise that resolves with `{ action: "OK" }` or `{ action: "CANCEL" }`.
     *
     * @example
     * const { action } = await kf.client.showConfirm({
     *   title: "Delete record?",
     *   content: "This cannot be undone.",
     *   okText: "Delete",
     *   cancelText: "Cancel",
     * });
     * if (action === "OK") { ... }
     */
    showConfirm(args: {
        title: string;
        content: string;
        okText: string;
        cancelText: string;
    }) {
        return super._postMessageAsync(LISTENER_CMDS.CONFIRM, {
            data: {
                title: args.title,
                content: args.content,
                okText: args.okText || "Ok",
                cancelText: args.cancelText || "Cancel"
            }
        });
    }

    /**
     * Navigate the platform to the given URL.
     *
     * @param url - The URL to navigate to.
     *
     * @example
     * kf.client.redirect("https://example.com");
     */
    redirect(url: string) {
        return super._postMessageAsync(LISTENER_CMDS.REDIRECT, { url });
    }

    /**
     * Resolve a Kissflow image field value to a base64 data URL.
     *
     * Custom components (iframes) cannot load Kissflow-hosted images directly due to
     * CORS restrictions and 302 redirects to signed S3 URLs. This method fetches the
     * image in the parent window (which has the required session cookies) and returns
     * a self-contained `data:image/...;base64,...` URL that can be used as `<img src>`
     * without any CORS issues.
     *
     * @param imageValue - The image field value must contain a `key` property and
     * optionally a `photos` array. Uses `photos[1]` (preview resolution) when available,
     * falls back to `key`.
     * @returns A promise that resolves with the base64 data URL string.
     *
     * @example
     * const dataUrl = await kf.client.getImageUrl(imageFieldValue);
     * document.querySelector("#avatar").src = dataUrl;
     */
    getImageUrl(imageValue: Record<string, unknown>) {
        return this._postMessageAsync(LISTENER_CMDS.GET_IMAGE_URL, {
            imageValue
        });
    }

    /**
     * Open the platform's file picker, upload the selected file(s), and resolve
     * with their metadata.
     *
     * Custom components (iframes) cannot access the platform's authenticated upload
     * endpoints directly. This method opens the file picker in the parent window
     * (which has the required session), runs the full select → upload flow, and
     * resolves once all uploads settle with an array of the uploaded files'
     * metadata (each including `key`, `name`, `size`, `photos`, etc. — the same
     * shape consumed by `getImageUrl`).
     *
     * Always resolves with an array — a single-element array for single-file
     * pickers (e.g. `maxCount: 1` for `Image`), one entry per uploaded file for
     * multi-file pickers (e.g. `Attachment`). Resolves with `[]` if the user closes
     * the picker without completing any upload.
     *
     * @param options - File picker configuration (e.g. `fileExtensions`, `maxSize`,
     * `maxCount`, `imageProps`).
     * @returns A promise that resolves with an array of uploaded file metadata
     * objects (empty if the picker was closed without uploading anything).
     *
     * @example
     * const files = await kf.client.openFilePicker({ fileExtensions: ["JPG", "PNG"] });
     * if (files.length) onChange(files[0]); // single-file consumer (Image)
     *
     * @example
     * const files = await kf.client.openFilePicker({ maxCount: 10 });
     * if (files.length) onChange([...existing, ...files]); // multi-file consumer (Attachment)
     */
    openFilePicker(options: FilePickerOptions) {
        return this._postMessageAsync(LISTENER_CMDS.FILEPICKER_OPEN, {
            options
        });
    }

    /**
     * Upload a File object to Kissflow's S3 storage and resolve with its metadata.
     *
     * Use this when you have a File/Blob already in memory (e.g. a canvas drawing
     * converted to a PNG blob) and need to upload it without opening a file picker UI.
     * The platform runs the upload in the parent window (which has the required session)
     * and resolves with the uploaded file's `{ key, name, ... }` metadata — the same
     * shape returned by `openFilePicker`.
     *
     * Resolves with `null` if the upload fails.
     *
     * @param file - The File or Blob to upload.
     * @param fileName - Optional file name override (defaults to `file.name`).
     * @returns A promise that resolves with the uploaded file metadata, or `null` on failure.
     *
     * @example
     * const blob = await new Promise<Blob>(res => canvas.toBlob(res, 'image/png'));
     * const file = new File([blob], 'signature.png', { type: 'image/png' });
     * const result = await kf.client.uploadFile(file);
     * if (result) onChange(result);
     */
    uploadFile(file: UploadableFile, fileName?: string) {
        return this._postMessageAsync(LISTENER_CMDS.FILE_UPLOAD, {
            file,
            fileName: fileName ?? file.name
        });
    }

    /**
     * Open the platform's file preview (lightbox) for one or more files.
     *
     * `files` always accepts an array — pass a single-element array for fields like
     * `Image`, or the full list for multi-file fields like `Attachment`. The host's
     * preview UI natively renders next/prev navigation across the array; the SDK
     * just passes the file list through, no extra navigation surface is needed here.
     *
     * @param args - Preview configuration.
     * @param args.files - Array of file metadata objects to preview.
     * @param args.indexOfFile - Index of the file to open the preview on (default: 0).
     * @returns A promise that resolves once the user closes the preview.
     *
     * @example
     * await kf.client.openFilePreview({ files: [imageFieldValue] });
     * await kf.client.openFilePreview({ files: attachmentFieldValue, indexOfFile: 2 });
     */
    openFilePreview(args: {
        files: Record<string, unknown>[];
        indexOfFile?: number;
    }) {
        return this._postMessageAsync(LISTENER_CMDS.FILEPREVIEW_OPEN, {
            files: args.files,
            indexOfFile: args.indexOfFile ?? 0
        });
    }
}
