import { CloudUpload } from "lucide-react";
import { useState } from "react";

export default function UploadPage() {
  const supportedFormats = [".MD", ".PDF", ".PNG", ".JPG", ".HTML"];
  const [enlarged, setEnlarged] = useState(false);
  return (
    <div className="flex w-full gap-10 items-start justify-between">
      {/* LEFT SIDE: DROP ZONE (Takes up more space) */}
      <div
        className="flex-2 p-2 bg-surface-container-high hover:bg-surface-container-highest cursor-pointer transition-colors"
        onMouseEnter={() => setEnlarged(true)}
        onMouseLeave={() => setEnlarged(false)}
      >
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
                .{format}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: QUEUE & SETTINGS (Fixed width or flex-1) */}
      <div className="flex-1 flex flex-col gap-8 h-full">
        <div className="flex flex-col gap-4">
          <h1 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
            Active Queue
          </h1>
          <div className="max-h-75 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            <div className="bg-white p-4 shadow-sm border-b-2 border-primary">
              <p className="font-mono text-sm">Q3_financial_report.pdf</p>
            </div>
            <div className="bg-white p-4 shadow-sm border-b-2 border-primary">
              <p className="font-mono text-sm">research_notes.md</p>
            </div>
          </div>
        </div>

        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 transition-colors">
          UPLOAD
        </button>
      </div>
    </div>
  );
}
