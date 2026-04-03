import apiClient from "../common/apiClient";
import type ApiResponse from "../common/apiResponse";
import { loadUserData } from "../models/user";

export const FileStatus = { PRIVATE: "PRIVATE", PUBLISHED: "PUBLISHED" };

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  files: FileData[];
}

export interface FileData {
  id: string;

  originalFileName: string;

  size: number;

  contentType: string;

  path: string;

  accessed: Date;

  createdAt: Date;

  status: string;
}

interface FileUploadResponse {
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  success: boolean;
  errorMessage: string | null;
}
interface PublishFile {
  id: string;
  shortURL: string;
  appFile: FileData;
}
export default class UserService {
  static async publishFile(fileId: string): Promise<ApiResponse<PublishFile>> {
    return await apiClient.post<PublishFile>(`/users/files/${fileId}/publish`);
  }
  static async uploadFiles(
    files: File[],
  ): Promise<ApiResponse<FileUploadResponse[]>> {
    const user = loadUserData();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await apiClient.post<FileUploadResponse[]>(
      `/users/upload`,
      formData,
    );
    console.log("Upload response:", res);

    return res;
  }

  static getUserProfile = async (): Promise<ApiResponse<UserProfileData>> => {
    const res = await apiClient.get<UserProfileData>(
      `/users/${loadUserData()?.id}`,
    );

    return res;
  };

  static async deleteFile(fileId: string): Promise<boolean> {
    const res = await apiClient.delete(`/users/files/${fileId}`);
    return res.ok;
  }
}
