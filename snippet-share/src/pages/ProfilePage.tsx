import UserService, {
  FileStatus,
  type UserProfileData,
} from "@/features/services/uploadService";
import { supportedFormats } from "@/lib/supportedFiles";
import { FileIcon, Share2, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ProfilePage() {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const openModal = (fileId: string) => {
    setSelectedFileId(fileId);
    setShowPublishModal(true);
  };
  const handlePublish = async () => {
    try {
      const success = await UserService.publishFile(selectedFileId!);
      if (success) {
        toast.success("File published successfully");
      } else {
        toast.error("Failed to publish file");
      }
    } catch (error) {
      toast.error(
        "An error occurred while publishing the file " +
          (error instanceof Error ? error.message : ""),
      );
    } finally {
      setShowPublishModal(false);
      setSelectedFileId(null);
    }
  };

  const handelFileDelete = async (fileId: string) => {
    const success = await UserService.deleteFile(fileId);
    if (success) {
      toast.success("File deleted successfully");
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              files: prev.files.filter((file) => file.id !== fileId),
            }
          : prev,
      );
    } else {
      toast.error("Failed to delete file");
    }
  };
  const buildIcon = (contentType: string) => {
    const format = supportedFormats.find((f) => f.contentType === contentType);
    return format ? <format.icon className="w-6 h-6" /> : null;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await UserService.getUserProfile();
        console.log("Profile data response:", res);
        if (res.success) {
          setProfileData(res.data);
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (error) {
        toast.error(
          "An error occurred while fetching profile data " +
            (error instanceof Error ? error.message : ""),
        );
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Modal to confirm sharing the file */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        style={{ display: showPublishModal ? "flex" : "none" }}
      >
        <div className="bg-surface p-6 rounded-lg">
          <h2 className="text-on-background text-xl font-bold mb-4">
            Confirm Publish
          </h2>
          <p className="text-on-surface mb-6">
            Are you sure you want to publish this file? It will be accessible to
            anyone with the link.
          </p>
          <div className="flex justify-end gap-4">
            <button className="px-4 py-2 bg-secondary text-on-secondary rounded">
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-primary text-on-primary rounded"
              onClick={async () => await handlePublish()}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
      {/* User Card */}
      <div className="flex flex-row gap-4">
        <div className="flex min-w-32 min-h-32 bg-on-surface items-center justify-center">
          <span className="text-white text-6xl font-semibold">
            {profileData?.name.at(0)?.toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-on-background font-bold text-5xl">
            {profileData?.name.toUpperCase()}
          </h1>

          <h1 className="text-on-primary-container font-stretch-bold text-xl">
            {profileData?.email}
          </h1>
        </div>
      </div>
      <hr className="my-6 border-on-surface-variant[50]" />
      <div>
        {profileData?.files.length === 0 ? (
          <p className="text-on-surface-variant">No files uploaded yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {profileData?.files.map((file) => (
              <div
                key={file.id}
                className="flex flex-row items-center gap-4 p-4 bg-on-primary border-l-2 border-l-primary-container"
              >
                <div className="flex items-center justify-center text-on-surface">
                  {buildIcon(file.contentType) || (
                    <FileIcon className="w-6 h-6" />
                  )}
                </div>
                <h2 className="text-on-background font-medium text-lg">
                  {file.originalFileName}
                </h2>
                <h2 className="text-on-background font-medium text-lg">
                  {file.size}
                </h2>
                {file.status === FileStatus.PUBLISHED ? (
                  <span className="text-green-500 text-xs font-bold uppercase">
                    PUBLISHED
                  </span>
                ) : (
                  <span className="text-yellow-500 text-xs font-bold uppercase">
                    PRIVATE
                  </span>
                )}
                <button onClick={() => openModal(file.id)}>
                  <Share2 />
                </button>
                <button onClick={() => handelFileDelete(file.id)}>
                  <Trash2Icon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
