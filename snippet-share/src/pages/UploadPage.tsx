import UserService from "@/features/services/uploadService";
import { CloudUpload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const supportedFormats = [".MD", ".PDF", ".PNG", ".JPG", ".HTML"];

// TODO: Handle Drag & Drop functionality, file validation, and actual upload logic
export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enlarged, setEnlarged] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleupload = async () => {
    const res = await UserService.uploadFiles(files);
    if (res.success) {
      toast.success("Files uploaded successfully!");
      setFiles([]); // Clear the queue after successful upload
    } else {
      toast.error(
        `Upload failed: ${res.data.map((f) => f.errorMessage).join(", ")}`,
      );
    }
  };

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handldFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  return (
    <div className="flex w-full gap-10 items-stretch justify-between">
      {/* LEFT SIDE: DROP ZONE (Takes up more space) */}
      <div
        className="flex-2 p-2 bg-surface-container-high hover:bg-surface-container-highest cursor-pointer transition-colors"
        onMouseEnter={() => setEnlarged(true)}
        onMouseLeave={() => setEnlarged(false)}
        onClick={handleInputClick}
      >
        <input
          type="file"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handldFileChange}
        />
        <div className="flex flex-col items-center justify-center gap-6 p-16 border-2 border-dashed border-primary-container">
          <CloudUpload
            className={`text-primary-container w-16 h-16 transition-transform duration-150 ${
              enlarged ? "scale-110" : ""
            }`}
          />
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            Drag & Drop Documents
          </h1>
          <h2 className="text-xl text-on-surface-variant">
            or{" "}
            <span className="text-primary-container underline">
              browse files
            </span>{" "}
            from your computer
          </h2>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {supportedFormats.map((format) => (
              <span
                key={format}
                className="bg-secondary-fixed-dim text-xs font-bold uppercase text-on-surface px-3 py-1"
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: QUEUE & SETTINGS (Fixed width or flex-1) */}
      <div className="flex-1 flex flex-col gap-8 justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
            Active Queue
          </h1>
          <div className="max-h-75 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {files.length === 0 ? (
              <p className="mt-2 text-sm text-on-surface-variant italic">
                No files in the queue. Please add some documents to upload.
              </p>
            ) : (
              files.map((file) => (
                <div
                  key={file.name}
                  className="bg-white p-4 shadow-sm border-b-2 border-primary"
                >
                  <p className="font-mono text-sm">{file.name}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={handleupload}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 transition-colors"
        >
          UPLOAD
        </button>
      </div>
    </div>
  );
}
