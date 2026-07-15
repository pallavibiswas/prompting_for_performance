import { useInView } from "../hooks/useInView";
import { CRAFT_DEFS } from "../lib/craftDefs";
import "../styles/CRAFTIntro.css";

const CRAFT_COLORS: Record<string, string> = {
  C: "#1A73E8",
  R: "#7C3AED",
  A: "#059669",
  F: "#D97706",
  T: "#DC2626",
};

const POWERUPS: Record<
  string,
  { name: string; snippet: string }
> = {
  C: {
    name: "Few-Shot",
    snippet:
      "Here are two examples in the style I need … now do this one the same way.",
  },
  R: {
    name: "Persona",
    snippet:
      "Act as a skeptical reviewer who flags the weakest arguments first.",
  },
  A: {
    name: "Chain of Thought",
    snippet:
      "Walk through your reasoning step by step before the final answer.",
  },
  F: {
    name: "Self-Evaluation",
    snippet:
      "Give a one-page summary, then tell me which part you're least confident about and why.",
  },
  T: {
    name: "Rephrase & Respond",
    snippet:
      "Repeat my ask back in one sentence before you start.",
  },
};

const CRAFT_KEYS = ["C", "R", "A", "F", "T"] as const;

export default function CRAFTIntro() {
  const [ref, inView] = useInView(0.1);

  const fadeIn = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView
      ? "translateY(0)"
      : "translateY(20px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <section
      id="craft-intro"
      ref={ref}
      className="craft-intro"
    >
      <div className="craft-intro__container">
        <p
          className="craft-intro__eyebrow"
          style={fadeIn(0)}
        >
          06 / CRAFTing the Prompt
        </p>

        <h3
          className="craft-intro__heading"
          style={fadeIn(0.1)}
        >
          Maximizing the first prompt
        </h3>

        <p
          className="craft-intro__intro"
          style={fadeIn(0.2)}
        >
          A five-part structure designed to remove ambiguity and facilitate precision, every time.
        </p>

        <div
          className="craft-intro__cards"
          style={fadeIn(0.25)}
        >
          {CRAFT_KEYS.map(key => {
            const def = CRAFT_DEFS[key];
            const color = CRAFT_COLORS[key];

            return (
              <article
                key={key}
                className="craft-intro__card"
                style={{
                  borderColor: `${color}28`,
                }}
              >
                <div
                  className="craft-intro__letter"
                  style={{ background: color }}
                >
                  {key}
                </div>

                <div>
                  <div
                    className="craft-intro__card-label"
                    style={{ color }}
                  >
                    {def.label}
                  </div>

                  <div
                    className="craft-intro__card-line"
                    style={{
                      background: `${color}55`,
                    }}
                  />

                  <p className="craft-intro__card-desc">
                    {def.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div
          className="craft-intro__divider"
          style={fadeIn(0.35)}
        >
          <span className="craft-intro__divider-line" />

          <span className="craft-intro__divider-label">
            Power it up
          </span>

          <span className="craft-intro__divider-line" />
        </div>

        <div
          className="craft-intro__powerups"
          style={fadeIn(0.4)}
        >
          {CRAFT_KEYS.map(key => {
            const color = CRAFT_COLORS[key];
            const powerup = POWERUPS[key];

            return (
              <article
                key={key}
                className="craft-intro__powerup"
              >
                <div
                  className="craft-intro__powerup-letter"
                  style={{ background: color }}
                >
                  {key}
                </div>

                <div>
                  <div className="craft-intro__powerup-name">
                    {powerup.name}
                  </div>

                  <div
                    className="craft-intro__snippet"
                    style={{
                      background: `${color}10`,
                      borderColor: `${color}20`,
                    }}
                  >
                    “{powerup.snippet}”
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div
          className="craft-intro__hallucination"
          style={fadeIn(0.45)}
        >
          <div className="craft-intro__strategies">
            <div className="craft-intro__section-label">
              Hallucination minimization
            </div>

            <p className="craft-intro__section-copy">
              Give the AI a way out so it doesn't make
              one up.
            </p>

            {[
              {
                title: "Say what not to do",
                desc: "Set clear limits in the prompt itself.",
              },
              {
                title: `Allow "I don't know"`,
                desc: "Permission to admit uncertainty beats a confident guess.",
              },
            ].map((item, index) => (
              <article
                key={index}
                className="craft-intro__strategy-card"
              >
                <div className="craft-intro__strategy-title">
                  {item.title}
                </div>

                <div className="craft-intro__strategy-desc">
                  {item.desc}
                </div>
              </article>
            ))}
          </div>

          <div className="craft-intro__prompt-wrap">
            <div className="craft-intro__prompt-label">
              Consider adding this line to your next
              prompt:
            </div>

            <blockquote className="craft-intro__prompt">
              “If you do not have enough information,
              say{" "}
              <strong>
                'Ask me questions / I don't know'
              </strong>{" "}
              instead of guessing.”
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}