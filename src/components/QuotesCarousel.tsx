import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import { useMarkdown } from "../hooks/useMarkdown";
import { splitBlocks } from "../lib/parseMarkdown";
import Accordion from "./Accordion";
import "../styles/QuotesCarousel.css";

interface Quote {
  text: string;
  name: string;
  role: string;
}

function parseQuotes(raw: string): Quote[] {
  return splitBlocks(raw)
    .map(block => {
      const lines = block
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

      const text = lines[0] || "";
      const attribution = (lines[1] || "").replace(/^—\s*/, "");

      const commaIndex = attribution.indexOf(",");

      const name =
        commaIndex > -1
          ? attribution.slice(0, commaIndex).trim()
          : attribution.trim();

      const role =
        commaIndex > -1
          ? attribution.slice(commaIndex + 1).trim()
          : "";

      return { text, name, role };
    })
    .filter(quote => quote.text.length > 0 && quote.name.length > 0);
}

export default function QuotesCarousel() {
  const [ref, inView] = useInView();
  const [current, setCurrent] = useState(0);

  const markdownPath = `${import.meta.env.BASE_URL}content/interview-quotes.md`;
  const { raw, loading, error } = useMarkdown(markdownPath);
  const researchPdfPath = `${import.meta.env.BASE_URL}pdfs/interview-insights.pdf`;

  const quotes = parseQuotes(raw);
  const activeQuote = quotes[current];

  useEffect(() => {
    if (current >= quotes.length && quotes.length > 0) {
      setCurrent(0);
    }
  }, [current, quotes.length]);

  const previousQuote = () => {
    if (quotes.length === 0) return;

    setCurrent(previous =>
      previous === 0 ? quotes.length - 1 : previous - 1
    );
  };

  const nextQuote = () => {
    if (quotes.length === 0) return;

    setCurrent(previous => (previous + 1) % quotes.length);
  };

  return (
    <section id="quotes" ref={ref} className="quotes">
      <div className="quotes__container">
        <p className="quotes__eyebrow">
          04 / Interview Voices
        </p>

        <h2 className="quotes__heading">
          Voices from the study
        </h2>

        <p className="quotes__intro">
            Perspectives gathered from participants across the study, highlighting recurring themes around AI adoption, trust, and similar behaviours.
        </p>

        {loading && (
          <p className="quotes__status">
            Loading quotes…
          </p>
        )}

        {!loading && error && (
          <p className="quotes__status quotes__status--error">
            {error}
          </p>
        )}

        {!loading && !error && quotes.length === 0 && (
          <p className="quotes__status">
            No quotes found — check public/content/interview-quotes.md
          </p>
        )}

      {!loading && activeQuote && (
        <>
          <div
            className="quotes__carousel"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView
                ? "translateY(0)"
                : "translateY(20px)",
              transition:
                "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <div
              key={current}
              className="quotes__active"
            >
              <blockquote className="quotes__blockquote">
                “{activeQuote.text}”
              </blockquote>

              <div className="quotes__attribution">
                <div className="quotes__name">
                  {activeQuote.name}
                </div>

                {activeQuote.role && (
                  <div className="quotes__role">
                    {activeQuote.role}
                  </div>
                )}
              </div>
            </div>

            <div className="quotes__controls">
              <button
                type="button"
                onClick={previousQuote}
                className="quotes__arrow"
                aria-label="Previous quote"
              >
                ←
              </button>

              <div
                className="quotes__dots"
                aria-label="Choose a quote"
              >
                {quotes.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrent(index)}
                    className={`quotes__dot ${
                      index === current
                        ? "quotes__dot--active"
                        : ""
                    }`}
                    aria-label={`Show quote ${index + 1}`}
                    aria-current={
                      index === current ? "true" : undefined
                    }
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextQuote}
                className="quotes__arrow"
                aria-label="Next quote"
              >
                →
              </button>

              <span className="quotes__counter">
                {String(current + 1).padStart(2, "0")} /{" "}
                {String(quotes.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="quotes__pdf">
            <Accordion
              label="View the interview insights (PDF)"
              pdfPath={researchPdfPath}
            />
          </div>
        </>
      )}

      </div>
    </section>
  );
}