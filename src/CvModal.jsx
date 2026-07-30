// CvModal.jsx
import { useEffect, useRef } from "react";

export default function CvModal({ isOpen, onClose, pdfUrl, onSave }) {
  const overlayRef = useRef(null);
  const downloadRef = useRef(null);
  const closeButtonRef = useRef(null);

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
  useEffect(() => { if (isOpen) closeButtonRef.current?.focus(); }, [isOpen]);

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
      className="term-modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-label="CV Preview"
    >
      <div className="term-card term-modalCard" onClick={(e) => e.stopPropagation()}>
        <div className="term-bar">
          <span className="term-titlebar-text">andras@portfolio: ~/cv.pdf</span>
        </div>

        <div className="term-modalBody">
          <object
            data={pdfUrl + "#toolbar=1&navpanes=0&view=FitH"}
            type="application/pdf"
            width="100%"
            className="term-modalPdf"
          >
            <iframe title="CV PDF" src={pdfUrl} className="term-modalPdf" />
            <p className="term-modalFallback">
              Your browser can’t display the PDF.{" "}
              <a href={pdfUrl} target="_blank" rel="noreferrer" className="term-link">Open in new tab</a>{" "}
              or <a href={pdfUrl} download className="term-link">download</a>.
            </p>
          </object>
        </div>

        <div className="term-modalFooter">
          {/* hidden anchor for programmatic download */}
          <a ref={downloadRef} href={pdfUrl} download style={{ display: "none" }}>download</a>

          <button onClick={handleSave} className="term-btn">
            [ Save ]
          </button>
          <button ref={closeButtonRef} onClick={onClose} className="term-btn">
            [ Close ]
          </button>
        </div>
      </div>
    </div>
  );
}
