import Accordion from "./Accordion";
import "../styles/DemoVideo.css";

// YouTube iframe format:
// https://www.youtube.com/embed/VIDEO_ID
const VIDEO_EMBED_URL =
  "https://www.youtube.com/embed/XV_s5U0fvdU";

export default function DemoVideo() {
  const pdfPath = `${import.meta.env.BASE_URL}pdfs/workshop-slides.pdf`;

  return (
    <section id="demo" className="demo-video">
      <div className="demo-video__container">
        <p className="demo-video__eyebrow">
          07 / Demo
        </p>

        <h2 className="demo-video__heading">
          See it in action
        </h2>

        <div className="demo-video__frame">
          <div
            className="demo-video__frame-glow"
            aria-hidden="true"
          />

          <div className="demo-video__aspect-ratio">
            <iframe
              src={VIDEO_EMBED_URL}
              title="Prompting for Performance — Research Overview"
              className="demo-video__iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        <div className="demo-video__accordion">
          <Accordion
            label="View workshop slide deck (PDF)"
            pdfPath={pdfPath}
          />
        </div>
      </div>
    </section>
  );
}