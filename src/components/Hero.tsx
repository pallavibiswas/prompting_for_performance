import { useEffect, useMemo, useState } from "react";
import { useMarkdown } from "../hooks/useMarkdown";
import "../styles/Hero.css";

interface CloudWord {
  text: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  depth: number;
  blue: boolean;
}

function parseCloudWords(raw: string): CloudWord[] {
  return raw
    .split("\n")
    .map(line => line.trim())
    .filter(
      line =>
        line &&
        !line.startsWith("<!---") &&
        !line.startsWith("---!>")
    )
    .map(line => {
      const [text, x, y, size, delay, depth, blue] = line
        .split("|")
        .map(value => value.trim());

      return {
        text,
        x: Number.parseFloat(x),
        y: Number.parseFloat(y),
        size: Number.parseFloat(size),
        delay: Number.parseFloat(delay),
        depth: Number.parseFloat(depth),
        blue: blue === "true",
      };
    })
    .filter(
      word =>
        Boolean(word.text) &&
        Number.isFinite(word.x) &&
        Number.isFinite(word.y) &&
        Number.isFinite(word.size)
    );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200);

  const markdownPath = `${import.meta.env.BASE_URL}content/cloud-words.md`;
  const { raw } = useMarkdown(markdownPath);

  const cloudWords = useMemo(() => parseCloudWords(raw), [raw]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setMounted(true);
        }, 120);

        const reducedMotionQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        const updateViewportWidth = () => {
            setViewportWidth(window.innerWidth);
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (
            window.innerWidth <= 800 ||
            reducedMotionQuery.matches
            ) {
            return;
            }

            setMouse({
            x: event.clientX / window.innerWidth - 0.5,
            y: event.clientY / window.innerHeight - 0.5,
            });
        };

        updateViewportWidth();

        window.addEventListener("resize", updateViewportWidth);
        window.addEventListener("mousemove", handleMouseMove, {
            passive: true,
        });

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener(
            "resize",
            updateViewportWidth
            );
            window.removeEventListener(
            "mousemove",
            handleMouseMove
            );
        };
    }, []);

  return (
    <section id="hero" className="hero">
      <div className="hero__glow" aria-hidden="true" />

      {/* Word cloud */}
      <div className="hero__cloud" aria-hidden="true">
        {cloudWords.map((word, index) => {
            const clamp = (
                value: number,
                min: number,
                max: number
            ) => Math.min(Math.max(value, min), max);

            const lerp = (
                start: number,
                end: number,
                amount: number
            ) => start + (end - start) * amount;

            /*
            * 0 at small-phone width.
            * 1 at desktop width.
            * Everything between smoothly interpolates.
            */
            const responsiveProgress = clamp(
                (viewportWidth - 360) / (1200 - 360),
                0,
                1
            );

            /*
            * Slightly separate tablet behavior from phones.
            * Phones need fewer and smaller words.
            */
            const isPhone = viewportWidth < 600;
            const isTablet =
                viewportWidth >= 600 &&
                viewportWidth < 1000;

            /*
            * Smooth font scaling.
            */
            const fontScale = lerp(
                0.48,
                0.86,
                responsiveProgress
            );

            /*
            * Smooth coordinate scaling.
            * Avoid the previous abrupt desktop/mobile jump.
            */
            const horizontalScale = lerp(
                0.68,
                1.08,
                responsiveProgress
            );

            const verticalScale = lerp(
                0.72,
                1.06,
                responsiveProgress
            );

            let xPosition = word.x * horizontalScale;
            let yPosition = word.y * verticalScale;

            /*
            * Dynamically sized viewport boundaries.
            * Longer words get extra horizontal breathing room.
            */
            const estimatedWordWidth =
                word.text.length *
                word.size *
                fontScale *
                0.65;

            const horizontalPadding = 16;

            const maxX = Math.max(
                70,
                viewportWidth / 2 -
                estimatedWordWidth / 2 -
                horizontalPadding
            );

            const viewportHeight =
                typeof window !== "undefined"
                ? window.innerHeight
                : 800;

            const maxY = Math.max(
                170,
                viewportHeight / 2 - 56
            );

            xPosition = clamp(
                xPosition,
                -maxX,
                maxX
            );

            yPosition = clamp(
                yPosition,
                -maxY,
                maxY
            );

            /*
            * Smooth central protected zone.
            */
            const centerZoneX = lerp(
                105,
                210,
                responsiveProgress
            );

            const centerZoneY = lerp(
                160,
                200,
                responsiveProgress
            );

            if (
                Math.abs(xPosition) < centerZoneX &&
                Math.abs(yPosition) < centerZoneY
            ) {
                const horizontalEscape =
                centerZoneX - Math.abs(xPosition);

                const verticalEscape =
                centerZoneY - Math.abs(yPosition);

                if (horizontalEscape < verticalEscape) {
                xPosition =
                    xPosition >= 0
                    ? centerZoneX
                    : -centerZoneX;
                } else {
                yPosition =
                    yPosition >= 0
                    ? centerZoneY
                    : -centerZoneY;
                }
            }

            /*
            * Hide some lower-priority words only on small phones.
            * This prevents 20+ words from being forced into a tiny area.
            */
            const shouldHideOnPhone =
                isPhone &&
                !word.blue &&
                index % 3 === 0;

            if (shouldHideOnPhone) {
                return null;
            }

            const parallaxStrength = lerp(
                0,
                45,
                responsiveProgress
            );

            const parallaxX =
                viewportWidth <= 800
                ? 0
                : mouse.x *
                    word.depth *
                    parallaxStrength;

            const parallaxY =
                viewportWidth <= 800
                ? 0
                : mouse.y *
                    word.depth *
                    parallaxStrength;

            const minimumFontSize = isPhone
                ? 7
                : isTablet
                ? 8
                : 9;

            return (
                <div
                key={`${word.text}-${index}`}
                className={`hero__cloud-word ${
                    word.blue
                    ? "hero__cloud-word--blue"
                    : "hero__cloud-word--muted"
                }`}
                style={{
                    left: "50%",
                    top: "50%",
                    transform: `
                    translate(
                        calc(-50% + ${xPosition + parallaxX}px),
                        calc(-50% + ${yPosition + parallaxY}px)
                    )
                    `,
                    fontSize: `${Math.max(
                    word.size * fontScale,
                    minimumFontSize
                    )}px`,
                    opacity: mounted
                    ? word.blue
                        ? lerp(
                            0.66,
                            0.82,
                            responsiveProgress
                        )
                        : lerp(
                            0.2,
                            0.28,
                            responsiveProgress
                        )
                    : 0,
                    transitionDelay: `${word.delay}s`,
                }}
                >
                {word.text}
                </div>
            );
        })}
      </div>

      <div className="hero__content">
        <div
          className={`hero__wordmark ${
            mounted ? "hero__wordmark--visible" : ""
          }`}
        >
          AI
        </div>

        <div
          className={`hero__copy ${
            mounted ? "hero__copy--visible" : ""
          }`}
        >
          <p className="hero__title">
            From Behind the Mind To Behind the Screen
          </p>

          <p className="hero__subtitle">
            A JPMorganChase Case Study
          </p>
        </div>
      </div>

      <div
        className={`hero__scroll ${
          mounted ? "hero__scroll--visible" : ""
        }`}
        aria-hidden="true"
      >
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}