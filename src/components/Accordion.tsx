import { useState } from "react";
import "../styles/Accordion.css";

interface AccordionProps {
    label: string;
    pdfPath: string;
}

export default function Accordion({
    label,
    pdfPath,
}: AccordionProps) {
    const [open, setOpen] = useState(false);
    const [missing, setMissing] = useState(false);
    const [checking, setChecking] = useState(false);

  const handleToggle = async () => {
      if (open) {
        setOpen(false);
        return;
      }

      if (!missing) {
        setChecking(true);

        try {
          const response = await fetch(pdfPath, {
            method: "HEAD",
          });

          if (!response.ok) {
            setMissing(true);
          }
        } catch {
          setMissing(true);
        } finally {
          setChecking(false);
        }
      }

      setOpen(true);
  };

  return (
    <div className="accordion">
      <button
        type="button"
        onClick={handleToggle}
        className="accordion__toggle"
        aria-expanded={open}
        aria-controls="workshop-pdf-panel"
      >
        <span className="accordion__label">
          {label}
        </span>

        <span
          className={`accordion__icon ${
            open ? "accordion__icon--open" : ""
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      <div
        id="workshop-pdf-panel"
        className={`accordion__panel ${
          open ? "accordion__panel--open" : ""
        }`}
      >
        <div className="accordion__content">
          {checking && (
            <div className="accordion__status">
              <span>Checking PDF…</span>
            </div>
          )}

          {!checking && open && missing && (
            <div className="accordion__status">
              <span className="accordion__status-title">
                PDF not found
              </span>

              <span className="accordion__status-path">
                {pdfPath}
              </span>

              <span className="accordion__status-help">
                Add the file to public/pdfs/ to enable this viewer.
              </span>
            </div>
          )}

          {!checking && open && !missing && (
            <iframe
              src={pdfPath}
              title={label}
              className="accordion__pdf"
            />
          )}
        </div>
      </div>
    </div>
  );
}