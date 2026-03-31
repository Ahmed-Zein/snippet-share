import apiClient from "../common/apiClient";
import type ApiResponse from "../common/apiResponse";
import { loadUserData } from "../models/user";
interface FileUploadResponse {
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  success: boolean;
  errorMessage: string | null;
}
export default class UploadService {
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
}
