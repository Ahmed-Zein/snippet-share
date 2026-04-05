import apiClient from "../common/apiClient";
import type ApiResponse from "../common/apiResponse";

// ── Backend DTOs (mirrors Java records) ──

export type FileStatus = "PRIVATE" | "PUBLISHED";

export interface AppFileDto {
  id: string;
  originalFileName: string;
  size: number;
  contentType: string;
  path: string;
  accessed: string;
  createdAt: string;
  status: FileStatus;
  publishedFile: PublishedFileInfo | null;
}

export interface UserProfileDto {
  id: string;
  email: string;
  name: string;
  files: AppFileDto[];
}

export interface FileUploadResponse {
  id: string;
  originalFileName: string;
  contentType: string;
  size: number;
  success: boolean;
  errorMessage: string | null;
  status: FileStatus;
}

export interface PublishedFileDto {
  id: string;
  shortURL: string;
  appFile: AppFileDto;
}
export interface PublishedFileInfo {
  id: string;
  shortURL: string;
}

// ── Helpers ──

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size < 10 ? size.toFixed(1) : Math.round(size)} ${units[i]}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Service ──

export default class UserService {
  static async getUserProfile(
    userId: string,
  ): Promise<ApiResponse<UserProfileDto>> {
    return apiClient.get<UserProfileDto>(`/users/${userId}`);
  }

  static async uploadFiles(
    files: File[],
  ): Promise<ApiResponse<FileUploadResponse[]>> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return apiClient.post<FileUploadResponse[]>("/users/upload", formData);
  }

  static async deleteFile(fileId: string): Promise<boolean> {
    const res = await apiClient.delete(`/users/files/${fileId}`);
    return res.ok;
  }

  static async publishFile(
    fileId: string,
  ): Promise<ApiResponse<PublishedFileDto>> {
    return apiClient.post<PublishedFileDto>(`/users/files/${fileId}/publish`);
  }
}
