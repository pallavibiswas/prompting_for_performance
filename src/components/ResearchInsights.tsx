import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useInView } from "../hooks/useInView";
import { useMarkdown } from "../hooks/useMarkdown";
import {
  splitBlocks,
  getField,
} from "../lib/parseMarkdown";
import "../styles/ResearchInsights.css";
import Accordion from "./Accordion";

interface InsightCard {
  front: string;
  intervention: string;
  desc: string;
  source: string;
}

function parseInsightCards(raw: string): InsightCard[] {
  return splitBlocks(raw)
    .map(block => ({
      front: getField(block, "Front"),
      intervention: getField(block, "Intervention"),
      desc: getField(block, "Description"),
      source: getField(block, "Source"),
    }))
    .filter(
      card =>
        card.front.length > 0 &&
        card.intervention.length > 0
    );
}

export default function ResearchInsights() {
  const [sectionRef, inView] = useInView();
  const [center, setCenter] = useState(0);
  const [flipped, setFlipped] = useState<
    Record<number, boolean>
  >({});

  const carouselRef = useRef<HTMLDivElement | null>(
    null
  );

  const cardRefs = useRef<
    Array<HTMLDivElement | null>
  >([]);

  const markdownPath = `${import.meta.env.BASE_URL}content/insight-cards.md`;
  const pdfPath = `${import.meta.env.BASE_URL}pdfs/research-methodology.pdf`;
  const { raw, loading, error } =
    useMarkdown(markdownPath);

  const cards = useMemo(
    () => parseInsightCards(raw),
    [raw]
  );

  useEffect(() => {
    if (cards.length > 0 && center >= cards.length) {
      setCenter(0);
    }
  }, [cards.length, center]);

  useEffect(() => {
    const activeCard = cardRefs.current[center];

    if (!activeCard) return;

    activeCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [center]);

  const goPrev = () => {
    if (cards.length === 0) return;

    setCenter(previous =>
      previous === 0
        ? cards.length - 1
        : previous - 1
    );
  };

  const goNext = () => {
    if (cards.length === 0) return;

    setCenter(previous =>
      (previous + 1) % cards.length
    );
  };

  const selectCard = (index: number) => {
    setCenter(index);
  };

  const flipCard = (index: number) => {
    setCenter(index);

    setFlipped(previous => ({
      ...previous,
      [index]: !previous[index],
    }));
  };

  return (
    <section
      id="insights"
      ref={sectionRef}
      className="insights"
    >
      <div className="insights__inner">
        <div className="insights__header">
          <p className="insights__eyebrow">
            05 / Research Insights
          </p>

          <h2 className="insights__heading">
            Discomfort → Intervention
          </h2>

          <p className="insights__intro">
            Select a card to explore it, then flip it
            to reveal the research-backed intervention.
          </p>
        </div>

        {loading && (
          <div className="insights__status-wrap">
            <p className="insights__status">
              Loading insights…
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="insights__status-wrap">
            <p className="insights__status insights__status--error">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          cards.length === 0 && (
            <div className="insights__status-wrap">
              <p className="insights__status">
                No cards found — check
                public/content/insight-cards.md
              </p>
            </div>
          )}

        {!loading && cards.length > 0 && (
          <>
            <div
              ref={carouselRef}
              className="insights__carousel"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition:
                  "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
              }}
            >
              {cards.map((card, index) => {
                const isSelected = index === center;
                const isFlipped =
                  Boolean(flipped[index]);

                return (
                  <div
                    key={`${card.front}-${index}`}
                    ref={node => {
                      cardRefs.current[index] = node;
                    }}
                    className={`insights__card-shell ${
                      isSelected
                        ? "insights__card-shell--selected"
                        : ""
                    }`}
                    onClick={() =>
                      selectCard(index)
                    }
                  >
                    <button
                      type="button"
                      className="insights__card-button"
                      onClick={event => {
                        event.stopPropagation();
                        flipCard(index);
                      }}
                      aria-label={
                        isFlipped
                          ? `Show user experience for card ${index + 1}`
                          : `Show intervention for card ${index + 1}`
                      }
                      aria-pressed={isFlipped}
                    >
                      <div
                        className={`insights__card-inner ${
                          isFlipped
                            ? "insights__card-inner--flipped"
                            : ""
                        }`}
                      >
                        {/* Front */}
                        <div
                          className={`insights__card-face insights__card-front ${
                            isSelected
                              ? "insights__card-front--selected"
                              : ""
                          }`}
                        >
                          <span className="insights__card-kicker">
                            User Experience
                          </span>

                          <p className="insights__front-text">
                            {card.front}
                          </p>

                          <div className="insights__flip-hint">
                            <span aria-hidden="true">
                              ↻
                            </span>
                            Flip for intervention
                          </div>
                        </div>

                        {/* Back */}
                        <div className="insights__card-face insights__card-back">
                          <span className="insights__back-kicker">
                            Intervention
                          </span>

                          <div>
                            <div className="insights__intervention-title">
                              {card.intervention}
                            </div>

                            <p className="insights__intervention-desc">
                              {card.desc}
                            </p>
                          </div>

                          {card.source && (
                            <div className="insights__source">
                              Source: {card.source}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="insights__controls">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous insight"
                className="insights__arrow"
              >
                ←
              </button>

              <div
                className="insights__dots"
                aria-label="Select an insight"
              >
                {cards.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setCenter(index)
                    }
                    aria-label={`Show insight ${index + 1}`}
                    aria-current={
                      index === center
                        ? "true"
                        : undefined
                    }
                    className={`insights__dot ${
                      index === center
                        ? "insights__dot--active"
                        : ""
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                aria-label="Next insight"
                className="insights__arrow"
              >
                →
              </button>

              <span className="insights__counter">
                {String(center + 1).padStart(
                  2,
                  "0"
                )}{" "}
                /{" "}
                {String(cards.length).padStart(
                  2,
                  "0"
                )}
              </span>
            </div>

            <div className="insights__accordion">
              <Accordion
                label="View Research Methodology (PDF)"
                pdfPath={pdfPath}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}