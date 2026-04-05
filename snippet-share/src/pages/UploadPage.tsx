import UserService, { formatFileSize } from "@/features/services/uploadService";
import { supportedFormats } from "@/lib/supportedFiles";
import { CloudUpload, FileIcon, Loader2, X } from "lucide-react";
import { useCallback, useRef, useState, type DragEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB, matches backend

function getFileIcon(contentType: string) {
  const match = supportedFormats.find((f) => f.contentType === contentType);
  return match ? (
    <match.icon className="w-4 h-4" />
  ) : (
    <FileIcon className="w-4 h-4" />
  );
}

function getExtension(name: string) {
  const idx = name.lastIndexOf(".");
  return idx === -1 ? "" : name.slice(idx).toLowerCase();
}

function isSupported(name: string) {
  return true; // allowed for now, we can do more thorough checks in the backend and show per-file errors on upload results
  const ext = getExtension(name);
  return supportedFormats.some((f) => f.name.toLowerCase() === ext);
}

function getContentType(name: string): string {
  const ext = getExtension(name);
  const match = supportedFormats.find((f) => f.name.toLowerCase() === ext);
  return match?.contentType ?? "application/octet-stream";
}

interface QueuedFile {
  file: File;
  id: string; // unique key using name + size + lastModified
}

export default function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ── Helpers ──

  const addFiles = useCallback(
    (incoming: File[]) => {
      const newFiles: QueuedFile[] = [];

      for (const file of incoming) {
        const id = `${file.name}-${file.size}-${file.lastModified}`;

        // Duplicate check
        if (
          queue.some((q) => q.id === id) ||
          newFiles.some((q) => q.id === id)
        ) {
          toast.warning(`"${file.name}" is already in the queue`);
          continue;
        }

        // Format check
        if (!isSupported(file.name)) {
          toast.error(`"${file.name}" is not a supported format`);
          continue;
        }

        // Size check
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`"${file.name}" exceeds the 10MB limit`);
          continue;
        }

        newFiles.push({ file, id });
      }

      if (newFiles.length > 0) {
        setQueue((prev) => [...prev, ...newFiles]);
      }
    },
    [queue],
  );

  const removeFile = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const clearQueue = () => {
    setQueue([]);
    // Reset the input so re-selecting the same file fires onChange
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Handlers ──

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = ""; // reset for re-selection
    }
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only unset if we're leaving the drop zone entirely (not entering a child)
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUpload = async () => {
    if (queue.length === 0) return;

    setUploading(true);
    try {
      const files = queue.map((q) => q.file);
      const res = await UserService.uploadFiles(files);

      if (res.success) {
        const results = res.data;

        // Check for per-file errors
        const failures = results.filter((r) => !r.success);
        const successes = results.filter((r) => r.success);

        if (failures.length > 0) {
          toast.error(
            `${failures.length} file(s) failed: ${failures.map((f) => f.errorMessage).join(", ")}`,
          );
        }

        if (successes.length > 0) {
          toast.success(`${successes.length} file(s) uploaded!`);
          clearQueue();

          // Navigate to profile to see uploaded files
          navigate("/");
        }
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

  // ── Render ──

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Upload Files
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Share code snippets, documents, and images. Max 10MB per file.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
          ${
            dragging
              ? "border-orange-400 bg-orange-50 scale-[1.01]"
              : "border-zinc-200 bg-zinc-50/50 hover:border-orange-300 hover:bg-orange-50/30"
          }
          ${uploading ? "pointer-events-none opacity-50" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          // accept={supportedFormats.map((f) => f.name.toLowerCase()).join(",")}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-4 p-12">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200
              ${dragging ? "bg-orange-100 text-orange-600" : "bg-zinc-100 text-zinc-400"}`}
          >
            <CloudUpload className="w-8 h-8" />
          </div>

          <div className="text-center">
            <p className="text-base font-semibold text-zinc-900">
              {dragging ? "Drop your files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              or <span className="text-orange-600 font-medium">browse</span>{" "}
              from your computer
            </p>
          </div>

          {/* Supported format badges */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-2">
            {supportedFormats.map((format) => (
              <span
                key={format.name}
                className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-[11px] font-semibold text-zinc-500 uppercase"
              >
                {format.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Queue */}
      {queue.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">
              Queue
              <span className="ml-2 text-xs font-normal text-zinc-400 normal-case">
                {queue.length} file{queue.length !== 1 ? "s" : ""} ·{" "}
                {formatFileSize(queue.reduce((sum, q) => sum + q.file.size, 0))}
              </span>
            </h2>
            <button
              onClick={clearQueue}
              disabled={uploading}
              className="text-xs text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2">
            {queue.map((item) => {
              const contentType = getContentType(item.file.name);
              const ext = getExtension(item.file.name)
                .toUpperCase()
                .replace(".", "");

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-white rounded-lg border border-zinc-100 p-3 group"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-md bg-zinc-50 text-zinc-500 shrink-0">
                    {getFileIcon(contentType)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {item.file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-400">
                        {formatFileSize(item.file.size)}
                      </span>
                      <span className="text-[11px] font-semibold text-zinc-300 uppercase">
                        {ext}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFile(item.id)}
                    disabled={uploading}
                    className="p-1.5 rounded-md text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-colors bg-orange-600 text-white hover:bg-orange-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4" />
                Upload {queue.length} file{queue.length !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      )}

      {/* Empty queue hint */}
      {queue.length === 0 && (
        <p className="text-sm text-zinc-400 text-center">
          Drop some files above to get started
        </p>
      )}
    </div>
  );
}
