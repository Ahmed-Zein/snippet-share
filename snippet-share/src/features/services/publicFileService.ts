const API_BASE = "http://localhost:8080";

export interface PublicFileInfo {
  id: string;
  shortURL: string;
  appFile: {
    id: string;
    originalFileName: string;
    size: number;
    contentType: string;
    path: string;
    accessed: string;
    createdAt: string;
    status: string;
  };
}

export async function fetchPublicFileInfo(shortUrl: string): Promise<PublicFileInfo> {
  const res = await fetch(`${API_BASE}/pub/${shortUrl}/info`);
  if (!res.ok) throw new Error("File not found");
  return res.json();
}

export async function fetchPublicFileBlob(shortUrl: string): Promise<{ blob: Blob; contentType: string }> {
  const res = await fetch(`${API_BASE}/pub/${shortUrl}`);
  if (!res.ok) throw new Error("Failed to download file");
  const contentType = res.headers.get("Content-Type") || "application/octet-stream";
  const blob = await res.blob();
  return { blob, contentType };
}
