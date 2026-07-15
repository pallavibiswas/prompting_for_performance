import { useMemo, useState } from "react";
import { useMarkdown } from "../hooks/useMarkdown";
import { useInView } from "../hooks/useInView";
import { CRAFT_DEFS } from "../lib/craftDefs";
import {
  splitBlocks,
  getField,
} from "../lib/parseMarkdown";
import "../styles/CRAFTLab.css";

type CraftKey = "C" | "R" | "A" | "F" | "T";
type LabTab = "builder" | "preview" | "examples";

interface CraftExample {
  title: string;
  vals: Record<CraftKey, string>;
}

const CRAFT_KEYS: CraftKey[] = [
  "C",
  "R",
  "A",
  "F",
  "T",
];

function parseCraftExamples(
  raw: string
): CraftExample[] {
  return splitBlocks(raw)
    .map(block => ({
      title: getField(block, "Title"),
      vals: {
        C: getField(block, "C"),
        R: getField(block, "R"),
        A: getField(block, "A"),
        F: getField(block, "F"),
        T: getField(block, "T"),
      },
    }))
    .filter(example => example.title.length > 0);
}

const FIELD_THRESHOLDS: Record<
  CraftKey,
  number
> = {
  C: 80,
  R: 40,
  A: 80,
  F: 40,
  T: 40,
};

const SCORE_LABELS: Record<number, string> = {
  0: "Fill in sections to start building",
  20: "Good start: Context and Action matter most",
  40: "Getting there: add more detail",
  60: "Solid foundation: refine the specifics",
  80: "Strong prompt: review for precision",
  100: "Complete CRAFT prompt: ready to use",
};

function calcScore(
  values: Record<CraftKey, string>
): number {
  return CRAFT_KEYS.reduce((score, key) => {
    const complete =
      values[key].trim().length >=
      FIELD_THRESHOLDS[key];

    return score + (complete ? 20 : 0);
  }, 0);
}

export default function CRAFTLab() {
  const [ref, inView] = useInView();
  const [labTab, setLabTab] =
    useState<LabTab>("builder");
  const [activeKey, setActiveKey] =
    useState<CraftKey>("C");

  const [values, setValues] = useState<
    Record<CraftKey, string>
  >({
    C: "",
    R: "",
    A: "",
    F: "",
    T: "",
  });

  const markdownPath = `${import.meta.env.BASE_URL}content/craft-examples.md`;
  const { raw, loading, error } =
    useMarkdown(markdownPath);

  const examples = useMemo(
    () => parseCraftExamples(raw),
    [raw]
  );

  const score = calcScore(values);

  const scoreColor =
    score >= 80
      ? "#22C55E"
      : score >= 60
        ? "#1A73E8"
        : score >= 40
          ? "#F59E0B"
          : "#64748B";

  const assembled = CRAFT_KEYS
    .filter(
      key => values[key].trim().length > 0
    )
    .map(
      key =>
        `[${key}] ${CRAFT_DEFS[
          key
        ].label.toUpperCase()}\n${values[key]}`
    )
    .join("\n\n");

  const updateValue = (
    key: CraftKey,
    value: string
  ) => {
    setValues(previous => ({
      ...previous,
      [key]: value,
    }));
  };

  const loadExample = (
    example: CraftExample
  ) => {
    setValues(example.vals);
    setActiveKey("C");
    setLabTab("builder");
  };

  return (
    <section
      id="craft"
      ref={ref}
      className="craft-lab"
    >
      <div className="craft-lab__container">
        <p className="craft-lab__eyebrow">
          08 / CRAFT Lab
        </p>

        <h2 className="craft-lab__heading">
          Build better prompts
        </h2>

        <p className="craft-lab__intro">
          The CRAFT framework structures your
          prompts for maximum effectiveness.
        </p>

        <div className="craft-lab__tabs-wrap">
          <div
            className="craft-lab__tabs"
            role="tablist"
            aria-label="CRAFT Lab sections"
          >
            {(
              [
                "builder",
                "preview",
                "examples",
              ] as LabTab[]
            ).map(tab => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={labTab === tab}
                className={`craft-lab__tab ${
                  labTab === tab
                    ? "craft-lab__tab--active"
                    : ""
                }`}
                onClick={() =>
                  setLabTab(tab)
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div
          className="craft-lab__content"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateY(0)"
              : "translateY(18px)",
            transition:
              "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}
        >
          {labTab === "builder" && (
            <div className="craft-lab__builder">
              <div className="craft-lab__sidebar">
                <div className="craft-lab__field-list">
                  {CRAFT_KEYS.map(key => {
                    const length =
                      values[key].trim().length;

                    const filled =
                      length >=
                      FIELD_THRESHOLDS[key];

                    const partial =
                      length > 0 && !filled;

                    return (
                      <button
                        key={key}
                        type="button"
                        className={`craft-lab__field-button ${
                          activeKey === key
                            ? "craft-lab__field-button--active"
                            : ""
                        }`}
                        onClick={() =>
                          setActiveKey(key)
                        }
                      >
                        <span
                          className="craft-lab__field-letter"
                          style={{
                            background: filled
                              ? CRAFT_DEFS[key]
                                  .color
                              : partial
                                ? `${CRAFT_DEFS[key].color}55`
                                : "rgba(26,115,232,0.1)",
                          }}
                        >
                          {key}
                        </span>

                        <span className="craft-lab__field-copy">
                          <span className="craft-lab__field-label">
                            {
                              CRAFT_DEFS[key]
                                .label
                            }
                          </span>

                          <span
                            className="craft-lab__field-status"
                            style={{
                              color: filled
                                ? "#22C55E"
                                : partial
                                  ? "#F59E0B"
                                  : "#94A3B8",
                            }}
                          >
                            {filled
                              ? "Complete!"
                              : partial
                                ? "In progress…"
                                : "Empty"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="craft-lab__strength">
                  <div className="craft-lab__strength-header">
                    <span>Strength</span>

                    <strong
                      style={{
                        color: scoreColor,
                      }}
                    >
                      {score}%
                    </strong>
                  </div>

                  <div className="craft-lab__strength-track">
                    <div
                      className="craft-lab__strength-fill"
                      style={{
                        width: `${score}%`,
                        background: scoreColor,
                        boxShadow: `0 0 10px ${scoreColor}55`,
                      }}
                    />
                  </div>

                  <p className="craft-lab__strength-label">
                    {SCORE_LABELS[score]}
                  </p>

                  <div className="craft-lab__thresholds">
                    {CRAFT_KEYS.map(key => {
                      const length =
                        values[key].trim().length;

                      const percentage =
                        Math.min(
                          100,
                          Math.round(
                            (length /
                              FIELD_THRESHOLDS[
                                key
                              ]) *
                              100
                          )
                        );

                      return (
                        <div
                          key={key}
                          className="craft-lab__threshold"
                        >
                          <div className="craft-lab__threshold-header">
                            <span>{key}</span>
                            <span>
                              {percentage}%
                            </span>
                          </div>

                          <div className="craft-lab__threshold-track">
                            <div
                              className="craft-lab__threshold-fill"
                              style={{
                                width: `${percentage}%`,
                                background:
                                  percentage >=
                                  100
                                    ? "#22C55E"
                                    : CRAFT_DEFS[
                                        key
                                      ].color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="craft-lab__editor">
                <div className="craft-lab__editor-heading">
                  <span
                    className="craft-lab__active-label"
                    style={{
                      color:
                        CRAFT_DEFS[
                          activeKey
                        ].color,
                    }}
                  >
                    [{activeKey}]{" "}
                    {
                      CRAFT_DEFS[activeKey]
                        .label
                    }
                  </span>

                  <p className="craft-lab__active-desc">
                    {
                      CRAFT_DEFS[activeKey]
                        .desc
                    }
                  </p>

                  <p className="craft-lab__threshold-hint">
                    Aim for{" "}
                    {
                      FIELD_THRESHOLDS[
                        activeKey
                      ]
                    }
                    + characters for a complete{" "}
                    {CRAFT_DEFS[
                      activeKey
                    ].label.toLowerCase()}
                    .
                  </p>
                </div>

                <textarea
                  value={values[activeKey]}
                  onChange={event =>
                    updateValue(
                      activeKey,
                      event.target.value
                    )
                  }
                  placeholder={
                    CRAFT_DEFS[activeKey]
                      .placeholder
                  }
                  className="craft-lab__textarea"
                  style={{
                    borderColor: `${CRAFT_DEFS[activeKey].color}30`,
                  }}
                />

                <div className="craft-lab__example-hint">
                  <span>Example: </span>
                  <em>
                    {
                      CRAFT_DEFS[activeKey]
                        .example
                    }
                  </em>
                </div>
              </div>
            </div>
          )}

          {labTab === "preview" &&
            (assembled ? (
              <div className="craft-lab__preview">
                <div className="craft-lab__terminal">
                  <div className="craft-lab__terminal-bar">
                    <div className="craft-lab__terminal-dots">
                      <span />
                      <span />
                      <span />
                    </div>

                    <span className="craft-lab__terminal-title">
                      assembled-prompt.txt
                    </span>
                  </div>

                  <pre className="craft-lab__pre">
                    {assembled
                      .split("\n")
                      .map((line, index) => {
                        const match =
                          line.match(
                            /^\[([A-Z])\]/
                          );

                        const key =
                          match?.[1] as
                            | CraftKey
                            | undefined;

                        return (
                          <span
                            key={index}
                            style={{
                              color: key
                                ? CRAFT_DEFS[
                                    key
                                  ].color
                                : "#94A3B8",
                            }}
                          >
                            {line}
                          </span>
                        );
                      })}
                  </pre>
                </div>

                <div className="craft-lab__preview-strength">
                  <span>
                    Prompt Strength:
                  </span>

                  <strong
                    style={{
                      color: scoreColor,
                    }}
                  >
                    {score}%
                  </strong>

                  <div className="craft-lab__preview-track">
                    <div
                      style={{
                        width: `${score}%`,
                        background: scoreColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="craft-lab__empty">
                <p>
                  No prompt assembled yet. Add
                  content in the Builder tab.
                </p>
              </div>
            ))}

          {labTab === "examples" && (
            <>
              {loading && (
                <p className="craft-lab__status">
                  Loading examples…
                </p>
              )}

              {!loading && error && (
                <p className="craft-lab__status craft-lab__status--error">
                  {error}
                </p>
              )}

              {!loading &&
                !error &&
                examples.length === 0 && (
                  <p className="craft-lab__status">
                    No examples found.
                  </p>
                )}

              {!loading &&
                examples.length > 0 && (
                  <div className="craft-lab__examples">
                    {examples.map(
                      (example, index) => (
                        <article
                          key={`${example.title}-${index}`}
                          className="craft-lab__example-card"
                        >
                          <div className="craft-lab__example-header">
                            <h3>
                              {example.title}
                            </h3>

                            <button
                              type="button"
                              onClick={() =>
                                loadExample(
                                  example
                                )
                              }
                            >
                              Load
                            </button>
                          </div>

                          <div className="craft-lab__example-terminal">
                            <pre className="craft-lab__example-pre">
                              {CRAFT_KEYS.map(
                                key => (
                                  <span
                                    key={key}
                                  >
                                    <span
                                      style={{
                                        color:
                                          CRAFT_DEFS[
                                            key
                                          ].color,
                                      }}
                                    >
                                      [{key}]{" "}
                                      {CRAFT_DEFS[
                                        key
                                      ].label.toUpperCase()}
                                    </span>
                                    {"\n"}
                                    <span className="craft-lab__example-value">
                                      {
                                        example
                                          .vals[key]
                                      }
                                    </span>
                                    {"\n\n"}
                                  </span>
                                )
                              )}
                            </pre>
                          </div>
                        </article>
                      )
                    )}
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}