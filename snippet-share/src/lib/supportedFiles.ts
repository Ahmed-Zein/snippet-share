import { File, FileCode, FileImage, FileText } from "lucide-react";

export const supportedFormats = [
  {
    name: ".MD",
    contentType: "text/markdown",
    icon: FileText,
  },
  { name: ".csv", contentType: "text/csv", icon: FileText },
  {
    name: ".PDF",
    contentType: "application/pdf",
    icon: File,
  },
  {
    name: ".PNG",
    contentType: "image/png",
    icon: FileImage,
  },
  {
    name: ".JPG",
    contentType: "image/jpeg",
    icon: FileImage,
  },
  {
    name: ".HTML",
    contentType: "text/html",
    icon: FileCode,
  },
];
