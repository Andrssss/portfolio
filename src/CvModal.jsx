// CvModal.jsx
import { useEffect, useRef } from "react";

export default function CvModal({ isOpen, onClose, pdfUrl, onSave }) {
  const overlayRef = useRef(null);
  const downloadRef = useRef(null);
  const firstButtonRef = useRef(null);

  // ESC to close + lock background scroll
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  // autofocus close button
  useEffect(() => { if (isOpen) firstButtonRef.current?.focus(); }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const handleSave = () => {
    downloadRef.current?.click();
    onSave?.();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="neo-modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-label="CV Preview"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        className="neo-modalCard"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#3C3C3C",
          width: "min(100%, 900px)",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(55, 23, 23, 0.2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
          
     

        <div className="neo-modalBody" style={{ padding: 0, flex: "1 1 auto", background: "#fafafa" }}>
          <object
            data={pdfUrl + "#toolbar=1&navpanes=0&view=FitH"}
            type="application/pdf"
            width="100%"
            style={{ height: "90vh", display: "block", border: "none" }}
          >
            <iframe title="CV PDF" src={pdfUrl} style={{ width: "100%", height: "70vh", border: "none" }} />
            <p style={{ padding: "1rem" }}>
              Your browser can’t display the PDF.{" "}
              <a href={pdfUrl} target="_blank" rel="noreferrer">Open in new tab</a>{" "}
              or <a href={pdfUrl} download>download</a>.
            </p>
          </object>
        </div>

        <div
          className="neo-modalFooter"
          style={{
            padding: "0.75rem 1rem",
            borderTop: "1px solid #eee",
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end",
          }}
        >
          {/* hidden anchor for programmatic download */}
          <a ref={downloadRef} href={pdfUrl} download style={{ display: "none" }}>download</a>

          <button
            onClick={handleSave}
            className="neo-btn neo-btn-primary"
            style={{
              background: "#0d6efd",
              color: "#fff",
              padding: "0.5rem 0.9rem",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="neo-btn neo-btn-light"
            style={{
              border: "1px solid #ddd",
              background: "#f8f8f8",
              padding: "0.5rem 0.9rem",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
