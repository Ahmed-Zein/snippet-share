import UserService, {
  type UserProfileData,
} from "@/features/services/uploadService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ProfilePage() {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);

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
                <div className="flex items-center justify-center w-12 h-12 bg-on-surface text-white rounded">
                  {file.originalFileName.at(0)?.toUpperCase()}
                </div>
                <h2 className="text-on-background font-medium text-lg">
                  {file.originalFileName}
                </h2>
                <h2 className="text-on-background font-medium text-lg">
                  {file.size}
                </h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
