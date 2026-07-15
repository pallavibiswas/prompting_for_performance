import { useInView } from "../hooks/useInView";
import { useMarkdown } from "../hooks/useMarkdown";
import { getField } from "../lib/parseMarkdown";
import { CRAFT_DEFS } from "../lib/craftDefs";
import "../styles/Solutions.css";

function parseSolutions(raw: string) {
  const g = (key: string) => getField(raw, key);

  return {
    eyebrow: g("eyebrow"),
    heading: g("heading"),
    intro: g("intro"),
    behavioral: {
      label: g("behavioral_label"),
      heading1: g("behavioral_heading_1"),
      heading2: g("behavioral_heading_2"),
      items: [1, 2, 3, 4]
        .map(n => ({
          title: g(`behavioral_item${n}_title`),
          desc: g(`behavioral_item${n}_desc`),
        }))
        .filter(item => item.title.length > 0),
    },
    technical: {
      label: g("technical_label"),
      heading1: g("technical_heading_1"),
      heading2: g("technical_heading_2"),
    },
  };
}

export default function Solutions() {
  const [ref, inView] = useInView(0.15);

  const markdownPath = `${import.meta.env.BASE_URL}content/solutions.md`;
  const { raw, loading, error } = useMarkdown(markdownPath);

  if (loading || !raw) {
    return (
      <section
        id="solutions"
        ref={ref}
        className="solutions solutions--loading"
      >
        <div className="solutions__loading-container">
          <p
            className="solutions__loading-text"
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

  const content = parseSolutions(raw);

  return (
    <section id="solutions" ref={ref} className="solutions">
      <div className="solutions__header">
        <p className="solutions__eyebrow">
          {content.eyebrow}
        </p>

        <h2 className="solutions__heading">
          {content.heading}
        </h2>

        <p className="solutions__intro">
          {content.intro}
        </p>
      </div>

      <div className="solutions__split">
        {/* Behavioural side */}
        <div
          className="solutions__panel solutions__panel--behavioral"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateX(0)"
              : "translateX(-44px)",
            transition:
              "opacity 0.95s ease 0.15s, transform 0.95s ease 0.15s",
          }}
        >
          <span className="solutions__panel-label">
            {content.behavioral.label}
          </span>

          <h3 className="solutions__panel-heading">
            <span>{content.behavioral.heading1}</span>
            <span>{content.behavioral.heading2}</span>
          </h3>

          <div className="solutions__behavioral-list">
            {content.behavioral.items.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="solutions__behavioral-item"
                style={{
                  opacity: inView ? 1 : 0,
                  transition: `opacity 0.7s ease ${
                    0.35 + index * 0.1
                  }s`,
                }}
              >
                <div className="solutions__behavioral-title">
                  {item.title}
                </div>

                <div className="solutions__behavioral-desc">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="solutions__divider"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.5s ease 0.1s",
          }}
          aria-hidden="true"
        >
          <div className="solutions__divider-icon">
            ×
          </div>
        </div>

        {/* Technical / CRAFT side */}
        <div
          className="solutions__panel solutions__panel--technical"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateX(0)"
              : "translateX(44px)",
            transition:
              "opacity 0.95s ease 0.15s, transform 0.95s ease 0.15s",
          }}
        >
          <span className="solutions__panel-label">
            {content.technical.label}
          </span>

          <h3 className="solutions__panel-heading">
            <span>{content.technical.heading1}</span>
            <span>{content.technical.heading2}</span>
          </h3>

          <div className="solutions__craft-row">
            {Object.entries(CRAFT_DEFS).map(([key, value], index) => (
              <div
                key={key}
                className="solutions__craft-step"
                style={{
                  opacity: inView ? 1 : 0,
                  transition: `opacity .6s ease ${0.35 + index * 0.08}s`,
                }}
              >
                <div
                  className="solutions__craft-letter"
                  style={{
                    background: `${value.color}18`,
                    borderColor: `${value.color}38`,
                    color: value.color,
                  }}
                >
                  {key}
                </div>

                <div className="solutions__craft-label">
                  {value.label}
                </div>

                {index < Object.keys(CRAFT_DEFS).length - 1 && (
                  <div className="solutions__craft-arrow"></div>
                )}
              </div>
            ))}
          </div>

          <div className="solutions__agents">

            <div className="solutions__agents-header">
              Choosing the Right Tool
            </div>

            <div className="solutions__agents-card">

              {/* Generative AI */}
              <div className="solutions__agent-column">

                <div className="solutions__agent-title">
                  Generative AI
                </div>

                <div className="solutions__workflow">
                  <div className="solutions__workflow-box">
                    Prompt
                  </div>

                  <span className="solutions__workflow-arrow">
                    →
                  </span>

                  <div className="solutions__workflow-box">
                    Answer
                  </div>
                </div>

                <div className="solutions__agent-caption">
                  One prompt. One response.
                </div>

                <div className="solutions__agent-subheading">
                  Best for
                </div>

                <ul className="solutions__agent-list">
                  <li>A quick answer, draft, or explanation</li>
                  <li>A single output you'll review or edit yourself</li>
                </ul>

              </div>

              <div className="solutions__agent-divider" />

              {/* AI Agent */}
              <div className="solutions__agent-column">

                <div className="solutions__agent-title">
                  AI Agent
                </div>

                <div className="solutions__workflow">
                  <div className="solutions__workflow-box">
                    Plan
                  </div>

                  <span className="solutions__workflow-arrow">
                    →
                  </span>

                  <div className="solutions__workflow-box">
                    Tools
                  </div>

                  <span className="solutions__workflow-arrow">
                    →
                  </span>

                  <div className="solutions__workflow-box">
                    Check
                  </div>
                </div>

                <div className="solutions__workflow-loop">
                  ↺ Repeat until complete
                </div>

                <div className="solutions__agent-subheading">
                  Best for
                </div>

                <ul className="solutions__agent-list">
                  <li>A multi-step task completed for you</li>
                  <li>Using tools, taking actions, and self-correcting</li>
                  <li>End-to-end execution, not just a suggestion</li>
                </ul>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}