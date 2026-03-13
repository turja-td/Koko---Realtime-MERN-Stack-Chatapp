import { Download, X } from "lucide-react";
import toast from "react-hot-toast";

const ImageModal = ({ isOpen, onClose, imgSrc }) => {
  if (!isOpen) return null;

  const handleDownload = async (e) => {
    e.stopPropagation(); // Prevent closing the modal

    // Create a loading toast
    const downloadToast = toast.loading("Preparing download...");

    try {
      const response = await fetch(imgSrc);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Extract filename or default to koko-image
      const filename = imgSrc.split("/").pop().split("?")[0] || "koko-image";
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download started!", { id: downloadToast });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed. Please try again.", { id: downloadToast });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out p-4"
      onClick={onClose}
    >
      {/* Top Controls */}
      <div className="absolute top-5 right-5 flex items-center gap-4">
        <button
          onClick={handleDownload}
          className="p-2.5 bg-base-300/50 hover:bg-base-300 text-white rounded-full transition-all border border-white/10"
          title="Download Image"
        >
          <Download className="size-6" />
        </button>

        <button
          className="p-2.5 bg-base-300/50 hover:bg-base-300 text-white rounded-full transition-all border border-white/10"
          onClick={onClose}
          title="Close"
        >
          <X className="size-6" />
        </button>
      </div>

      <img
        src={imgSrc}
        alt="Full screen preview"
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ImageModal;
