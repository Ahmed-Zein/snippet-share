import { supportedFormats } from "@/lib/supportedFiles";
import { FileIcon } from "lucide-react";

export function getFileIcon(contentType: string) {
  const match = supportedFormats.find((f) => f.contentType === contentType);
  return match ? (
    <match.icon className="w-5 h-5" />
  ) : (
    <FileIcon className="w-5 h-5" />
  );
}
