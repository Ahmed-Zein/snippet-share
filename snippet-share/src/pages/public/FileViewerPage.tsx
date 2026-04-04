import { fetchPublicFileInfo, fetchPublicFileBlob, type PublicFileInfo } from "@/features/services/publicFileService";
import { formatFileSize, formatDate } from "@/features/services/uploadService";
import { ArrowLeft, Code, Download, FileText, Image, Loader2, Table, FileCode } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";

// ── Content Type Routing ──

type ViewerType = "image" | "pdf" | "markdown" | "csv" | "html" | "code" | "fallback";

function getViewerType(contentType: string): ViewerType {
  if (contentType.startsWith("image/")) return "image";
  if (contentType === "application/pdf") return "pdf";
  if (contentType === "text/markdown") return "markdown";
  if (contentType === "text/csv") return "csv";
  if (contentType === "text/html") return "html";
  if (contentType.startsWith("text/") || contentType === "application/json") return "code";
  return "fallback";
}

// ── Viewers ──

function ImageViewer({ url }: { url: string }) {
  return (
    <div className="flex items-center justify-center bg-[repeating-conic-gradient(#f5f5f5_0%_25%,white_0%_50%)] bg-[length:20px_20px] rounded-lg min-h-[400px]">
      <img
        src={url}
        alt="Shared file"
        className="max-w-full max-h-[70vh] object-contain rounded"
      />
    </div>
  );
}

function PdfViewer({ url }: { url: string }) {
  return (
    <iframe
      src={url}
      className="w-full h-[75vh] rounded-lg border border-zinc-200"
      title="PDF viewer"
    />
  );
}

function MarkdownViewer({ text }: { text: string }) {
  const html = useMemo(() => {
    // Basic markdown rendering (no external lib needed)
    let rendered = text
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-5 mb-2 text-zinc-800">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-2 text-zinc-800">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3 text-zinc-900">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, '<code class="bg-zinc-100 text-orange-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-3 border-orange-400 pl-4 text-zinc-600 italic my-3">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-zinc-700">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 text-zinc-700 list-decimal">$2</li>')
      .replace(/\n/g, "<br />");
    return rendered;
  }, [text]);

  return (
    <div className="prose prose-zinc max-w-none">
      <div
        className="p-6 bg-white rounded-lg border border-zinc-100 font-sans text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function CsvViewer({ text }: { text: string }) {
  const { headers, rows } = useMemo(() => {
    const lines = text.trim().split("\n");
    if (lines.length === 0) return { headers: [] as string[], rows: [] as string[][] };

    const parsed = lines.map((line) =>
      line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))
    );
    return { headers: parsed[0], rows: parsed.slice(1) };
  }, [text]);

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-50 border-b border-zinc-200">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 font-semibold text-zinc-700 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-zinc-600 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HtmlViewer({ url }: { url: string }) {
  return (
    <iframe
      src={url}
      sandbox="allow-scripts"
      className="w-full h-[75vh] rounded-lg border border-zinc-200 bg-white"
      title="HTML viewer"
    />
  );
}

function CodeViewer({ text, fileName }: { text: string; fileName: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 text-zinc-400 text-xs">
        <span className="font-mono">{fileName}</span>
        <span>plaintext</span>
      </div>
      <pre className="p-4 bg-zinc-900 text-zinc-100 text-sm overflow-x-auto max-h-[65vh]">
        <code className="font-mono">{text}</code>
      </pre>
    </div>
  );
}

function FallbackViewer({ info }: { info: PublicFileInfo }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FileText className="w-12 h-12 text-zinc-300 mb-4" />
      <p className="text-base font-medium text-zinc-900 mb-1">
        {info.appFile.originalFileName}
      </p>
      <p className="text-sm text-zinc-500 mb-6">
        This file type ({info.appFile.contentType}) cannot be previewed in the browser.
      </p>
      <a
        href={`${window.location.origin}/pub/${info.shortURL}`}
        download={info.appFile.originalFileName}
        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download File
      </a>
    </div>
  );
}

// ── Loading / Error ──

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      <p className="text-sm text-zinc-500">Loading file...</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <span className="text-2xl">😕</span>
      </div>
      <p className="text-base font-medium text-zinc-900 mb-1">File not found</p>
      <p className="text-sm text-zinc-500 mb-6 max-w-sm">
        {message || "This link may have expired or the file was removed."}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Home
      </Link>
    </div>
  );
}

// ── Page ──

export default function FileViewerPage() {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const [info, setInfo] = useState<PublicFileInfo | null>(null);
  const [fileContent, setFileContent] = useState<{ type: "blob"; url: string } | { type: "text"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shortUrl) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchPublicFileInfo(shortUrl)
      .then((fileInfo) => {
        if (cancelled) return;
        setInfo(fileInfo);

        const viewerType = getViewerType(fileInfo.appFile.contentType);

        if (viewerType === "image" || viewerType === "pdf" || viewerType === "html") {
          // For binary formats, create an object URL
          return fetchPublicFileBlob(shortUrl).then(({ blob }) => {
            if (cancelled) return;
            const url = URL.createObjectURL(blob);
            setFileContent({ type: "blob", url });
          });
        } else {
          // For text formats, read as text
          return fetchPublicFileBlob(shortUrl).then(({ blob }) => {
            if (cancelled) return;
            return blob.text().then((text) => {
              if (cancelled) return;
              setFileContent({ type: "text", text });
            });
          });
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shortUrl]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (fileContent?.type === "blob") {
        URL.revokeObjectURL(fileContent.url);
      }
    };
  }, [fileContent]);

  if (loading) return <SimpleLayout><LoadingState /></SimpleLayout>;
  if (error || !info) return <SimpleLayout><ErrorState message={error || undefined} /></SimpleLayout>;

  const viewerType = getViewerType(info.appFile.contentType);
  const file = info.appFile;

  return (
    <SimpleLayout>
      {/* File header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 text-orange-600 shrink-0">
              <ViewerIcon type={viewerType} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-zinc-900 truncate">{file.originalFileName}</h1>
              <p className="text-sm text-zinc-500">
                {formatFileSize(file.size)} · {formatDate(info.id ? file.createdAt : new Date().toISOString())}
              </p>
            </div>
          </div>

          <a
            href={`http://localhost:8080/pub/${shortUrl}`}
            download={file.originalFileName}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </div>

      {/* Viewer */}
      {fileContent?.type === "blob" && (
        <>
          {viewerType === "image" && <ImageViewer url={fileContent.url} />}
          {viewerType === "pdf" && <PdfViewer url={fileContent.url} />}
          {viewerType === "html" && <HtmlViewer url={fileContent.url} />}
        </>
      )}

      {fileContent?.type === "text" && (
        <>
          {viewerType === "markdown" && <MarkdownViewer text={fileContent.text} />}
          {viewerType === "csv" && <CsvViewer text={fileContent.text} />}
          {viewerType === "code" && <CodeViewer text={fileContent.text} fileName={file.originalFileName} />}
        </>
      )}

      {viewerType === "fallback" && <FallbackViewer info={info} />}
    </SimpleLayout>
  );
}

// ── Layout wrapper (no sidebar, no auth) ──

function SimpleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-base font-bold text-zinc-900 tracking-tight">
            Snippet Share
          </Link>
          <Link
            to="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

// ── Icon helper ──

function ViewerIcon({ type }: { type: ViewerType }) {
  switch (type) {
    case "image": return <Image className="w-5 h-5" />;
    case "pdf": return <FileText className="w-5 h-5" />;
    case "markdown": return <FileText className="w-5 h-5" />;
    case "csv": return <Table className="w-5 h-5" />;
    case "html": return <FileCode className="w-5 h-5" />;
    case "code": return <Code className="w-5 h-5" />;
    default: return <FileText className="w-5 h-5" />;
  }
}
