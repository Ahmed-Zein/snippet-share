import UserService, {
  type AppFileDto,
  formatDate,
  formatFileSize,
} from "@/features/services/uploadService";
import {
  ExternalLink,
  Link2,
  Loader2,
  MoreHorizontal,
  Share2,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getFileIcon } from "./utils";
import CopyButton from "./CopyButton";
// ── File Card ──

export default function FileCard({
  file,
  onPublish,
  onDelete,
}: {
  file: AppFileDto;
  onPublish: (file: AppFileDto) => void;
  onDelete: (fileId: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleDelete = async () => {
    setMenuOpen(false);
    setBusy(true);
    const ok = await UserService.deleteFile(file.id);
    setBusy(false);
    if (ok) {
      toast.success("File deleted");
      onDelete(file.id);
    } else {
      toast.error("Failed to delete file");
    }
  };

  const handleQuickShare = () => {
    onPublish(file);
  };

  return (
    <div className="relative bg-white rounded-xl border border-zinc-100 hover:border-orange-200 hover:shadow-sm transition-all group">
      {/* Top: file type icon area */}
      <div className="flex items-center justify-center h-24 bg-zinc-50 rounded-t-xl border-b border-zinc-100">
        <div className="text-zinc-400">{getFileIcon(file.contentType)}</div>
      </div>

      {/* Bottom: file info */}
      <div className="p-4">
        <p
          className="text-sm font-medium text-zinc-900 truncate"
          title={file.originalFileName}
        >
          {file.originalFileName}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-zinc-500">
            {formatFileSize(file.size)}
          </span>
          <span className="text-xs text-zinc-300">&middot;</span>
          <span className="text-xs text-zinc-500">
            {formatDate(file.createdAt)}
          </span>
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between mt-3">
          {file.status === "PUBLISHED" ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Shared
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
              Private
            </span>
          )}

          <div className="flex items-center gap-1">
            {/* Primary share button — always visible */}
            {file.status === "PUBLISHED" && file.publishedFile?.shortURL ? (
              <div className="flex items-center gap-2rounded-md ">
                <CopyButton
                  text={`${window.location.origin}/s/${file.publishedFile.shortURL}`}
                />
                <a
                  href={`${window.location.origin}/s/${file.publishedFile.shortURL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-md hover:bg-zinc-200 transition-colors"
                  title="Open link"
                >
                  <ExternalLink className="w-4 h-4 text-zinc-500" />
                </a>
              </div>
            ) : (
              <button
                onClick={handleQuickShare}
                disabled={busy || file.status === "PUBLISHED"}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
                title="Share this file"
              >
                {file.status === "PUBLISHED" ? (
                  <>
                    <Link2 className="w-3 h-3" />
                    Shared
                  </>
                ) : busy ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Share2 className="w-3 h-3" />
                    Share
                  </>
                )}
              </button>
            )}

            {/* Secondary: more menu (delete, etc.) */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                disabled={busy}
                className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600"
                title="More actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 bottom-full mb-1 w-40 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-10">
                  <button
                    onClick={handleDelete}
                    disabled={busy}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
