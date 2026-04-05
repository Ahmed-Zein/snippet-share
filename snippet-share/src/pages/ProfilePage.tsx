import CopyButton from "@/components/app/CopyButton";
import FileCard from "@/components/app/FileCard";
import { getFileIcon } from "@/components/app/utils";
import { useAuth } from "@/features/auth/useAuth";
import UserService, {
  type AppFileDto,
  type UserProfileDto,
  formatFileSize,
} from "@/features/services/uploadService";
import { ExternalLink, Loader2, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ── Publish Modal ──
function PublishModal({
  file,
  onConfirm,
  onClose,
  loading,
}: {
  file: AppFileDto;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-900">Share File</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
        <div className="bg-zinc-50 rounded-md p-3 mb-4 flex items-center gap-3">
          <div className="text-zinc-600">{getFileIcon(file.contentType)}</div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">
              {file.originalFileName}
            </p>
            <p className="text-xs text-zinc-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <p className="text-sm text-zinc-600 mb-6">
          Anyone with the link will be able to access this file.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Get Share Link
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Published URL Modal ──

function PublishedUrlModal({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-900">Share Link Ready!</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
        <p className="text-sm text-zinc-600 mb-4">
          Anyone with this link can access the file:
        </p>
        <div className="flex items-center gap-2 bg-zinc-50 rounded-md p-3">
          <code className="text-sm text-orange-600 font-mono flex-1 truncate">
            {url}
          </code>
          <CopyButton text={url} />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-md hover:bg-zinc-200 transition-colors"
            title="Open link"
          >
            <ExternalLink className="w-4 h-4 text-zinc-500" />
          </a>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ── Empty State ──

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
        <Share2 className="w-8 h-8 text-zinc-400" />
      </div>
      <h3 className="text-base font-medium text-zinc-900 mb-1">No files yet</h3>
      <p className="text-sm text-zinc-500 max-w-xs">
        Upload your first file to start sharing. We support MD, CSV, PDF, PNG,
        JPG, and HTML formats.
      </p>
    </div>
  );
}

// ── Page ──

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  const [publishTarget, setPublishTarget] = useState<AppFileDto | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    setLoading(true);
    UserService.getUserProfile(user.id)
      .then((res) => {
        if (!cancelled && res.success) {
          setProfile(res.data);
        } else if (!cancelled) {
          toast.error("Failed to load profile");
        }
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load profile");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handlePublish = async () => {
    if (!publishTarget) return;
    setPublishing(true);
    try {
      const res = await UserService.publishFile(publishTarget.id);
      if (res.success) {
        const published = res.data;
        toast.success("File published!");
        setPublishedUrl(`${window.location.origin}/s/${published.shortURL}`);
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                files: prev.files.map((f) =>
                  f.id === publishTarget.id
                    ? { ...f, status: "PUBLISHED" as const }
                    : f,
                ),
              }
            : prev,
        );
      } else {
        toast.error("Failed to publish file");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteLocal = (fileId: string) => {
    setProfile((prev) =>
      prev
        ? { ...prev, files: prev.files.filter((f) => f.id !== fileId) }
        : prev,
    );
  };

  const closePublishModal = () => {
    setPublishTarget(null);
    setPublishedUrl(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-zinc-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-zinc-200 rounded animate-pulse" />
            <div className="h-4 w-36 bg-zinc-100 rounded animate-pulse" />
          </div>
        </div>
        <hr className="border-zinc-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-100 overflow-hidden"
            >
              <div className="h-24 bg-zinc-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-zinc-100 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-zinc-50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {publishTarget && (
        <PublishModal
          file={publishTarget}
          onConfirm={handlePublish}
          onClose={closePublishModal}
          loading={publishing}
        />
      )}

      {publishedUrl && (
        <PublishedUrlModal url={publishedUrl} onClose={closePublishModal} />
      )}

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-orange-600 flex items-center justify-center shrink-0">
          <span className="text-white text-2xl font-semibold">
            {profile?.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {profile?.name}
          </h1>
          <p className="text-sm text-zinc-500">{profile?.email}</p>
        </div>
      </div>

      <hr className="border-zinc-200" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile?.files.length === 0 ? (
          <EmptyState />
        ) : (
          profile?.files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onPublish={setPublishTarget}
              onDelete={handleDeleteLocal}
            />
          ))
        )}
      </div>
    </div>
  );
}
