import apiClient from "../common/apiClient";
import type ApiResponse from "../common/apiResponse";
import { loadUserData } from "../models/user";

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
}

interface FileUploadResponse {
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  success: boolean;
  errorMessage: string | null;
}
export default class UserService {
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
      `/users/${user.id}/upload`,
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
}
