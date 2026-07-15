import { useEffect, useState } from "react";
import "../styles/Nav.css";

const navLinks = [
  { label: "Problem", id: "problem" },
  { label: "Solutions", id: "solutions" },
  { label: "Survey", id: "survey" },
  { label: "Interviews", id: "quotes" },
  { label: "Insights", id: "insights" },
  { label: "CRAFT-ing", id: "craft-intro" },
  { label: "Demo", id: "demo" },
  { label: "CRAFT Lab", id: "craft" },
  { label: "Journey", id: "journey" },
];

export default function Nav({ progress }: { progress: number }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 60);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setMenuOpen(false);
        }
      };

      const handleResize = () => {
        if (window.innerWidth > 960) {
          setMenuOpen(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    useEffect(() => {
      document.body.style.overflow = menuOpen ? "hidden" : "";

      return () => {
        document.body.style.overflow = "";
      };
    }, [menuOpen]);

    const scrollTo = (id: string) => {
      setMenuOpen(false);

      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    const navHasBackground = scrolled || menuOpen;

    return (
      <nav
        className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
        aria-label="Primary navigation"
        style={{
          background: navHasBackground
            ? "rgba(5,15,28,0.94)"
            : "transparent",
          backdropFilter: navHasBackground ? "blur(24px)" : "none",
          WebkitBackdropFilter: navHasBackground ? "blur(24px)" : "none",
          borderBottom: navHasBackground
            ? "1px solid rgba(26,115,232,0.12)"
            : "1px solid transparent",
        }}
      >
        {/* Scroll progress bar */}
        <div className="site-nav__progress-track">
          <div
            className="site-nav__progress-bar"
            style={{
              width: `${Math.min(Math.max(progress, 0), 100)}%`,
            }}
          />
        </div>

        <div className="site-nav__inner">
          {/* Logo lockup */}
          <button
            type="button"
            className="site-nav__logo"
            onClick={() => scrollTo("hero")}
            aria-label="Return to the top of the page"
          >
            <span className="site-nav__rutgers">Rutgers IDEA</span>

            <span className="site-nav__divider" aria-hidden="true">
              ×
            </span>

            <span className="site-nav__jpmorgan">
              JPMorganChase
            </span>
          </button>

          {/* Desktop navigation */}
          <div className="site-nav__desktop-links">
            {navLinks.map(link => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                className="site-nav__desktop-link"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className={`site-nav__toggle ${
              menuOpen ? "site-nav__toggle--open" : ""
            }`}
            onClick={() => setMenuOpen(current => !current)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-navigation"
          className={`site-nav__mobile-menu ${
            menuOpen ? "site-nav__mobile-menu--open" : ""
          }`}
        >
          <div className="site-nav__mobile-links">
            {navLinks.map((link, index) => (
              <button
                key={link.id}
                type="button"
                className="site-nav__mobile-link"
                onClick={() => scrollTo(link.id)}
                style={{
                  transitionDelay: menuOpen
                    ? `${70 + index * 45}ms`
                    : "0ms",
                }}
              >
                <span className="site-nav__mobile-index">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{link.label}</span>
              </button>
            ))}
          </div>

          <div className="site-nav__mobile-footer">
            Prompting for Performance
          </div>
        </div>

        {menuOpen && (
          <button
            type="button"
            className="site-nav__backdrop"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            tabIndex={-1}
          />
        )}
      </nav>
    );
}