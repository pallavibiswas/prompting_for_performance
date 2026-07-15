import { useInView } from "../hooks/useInView";
import { useMarkdown } from "../hooks/useMarkdown";
import { getField } from "../lib/parseMarkdown";
import "../styles/Problem.css";

function parseProblem(raw: string) {
  const g = (key: string) => getField(raw, key);

  return {
    eyebrow: g("eyebrow"),
    headingLine1: g("heading_line1"),
    headingLine2: g("heading_line2"),
    headingLine3: g("heading_line3"),
    bodyLeft: g("body_left"),
    bodyRight: g("body_right"),
    stats: [
      { stat: g("stat1_value"), label: g("stat1_label") },
      { stat: g("stat2_value"), label: g("stat2_label") },
      { stat: g("stat3_value"), label: g("stat3_label") },
    ],
  };
}

export default function Problem() {
  const [ref, inView] = useInView();

  const markdownPath = `${import.meta.env.BASE_URL}content/problem.md`;
  const { raw, loading, error } = useMarkdown(markdownPath);

  if (loading || !raw) {
    return (
      <section id="problem" ref={ref} className="problem problem--loading">
        <div className="problem__container">
          <p
            className="problem__loading-text"
            style={{
              color: error ? "#F87171" : "#64748B",
            }}
          >
            {error ? error : "Loading…"}
          </p>
        </div>
      </section>
    );
  }

  const content = parseProblem(raw);

  return (
    <section id="problem" ref={ref} className="problem">
      <div className="problem__container">
        <p
          className="problem__eyebrow"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          {content.eyebrow}
        </p>

        <h2
          className="problem__heading"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(28px)",
            transition:
              "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s",
          }}
        >
          <span>{content.headingLine1}</span>
          <span>{content.headingLine2}</span>
          <span className="problem__heading-accent">
            {content.headingLine3}
          </span>
        </h2>

        <div
          className="problem__body"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(24px)",
            transition:
              "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
          }}
        >
          <p>{content.bodyLeft}</p>
          <p>{content.bodyRight}</p>
        </div>

        <div
          className="problem__stats"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.9s ease 0.5s",
          }}
        >
          {content.stats.map((item, index) => (
            <div key={index} className="problem__stat">
              <div className="problem__stat-value">
                {item.stat}
              </div>

              <div className="problem__stat-label">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}