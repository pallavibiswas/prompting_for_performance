import { useEffect, useState } from "react";

const cache = new Map<string, string>();

interface UseMarkdownResult {
  raw: string;
  loading: boolean;
  error: string | null;
}

export function useMarkdown(path: string): UseMarkdownResult {
  const cachedValue = cache.get(path);

  const [raw, setRaw] = useState(cachedValue ?? "");
  const [loading, setLoading] = useState(!cachedValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadMarkdown = async () => {
      const cached = cache.get(path);

      if (cached !== undefined) {
        setRaw(cached);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(path);

        if (!response.ok) {
          throw new Error(
            `Could not load ${path}: ${response.status} ${response.statusText}`
          );
        }

        const contentType = response.headers.get("content-type") ?? "";

        if (contentType.includes("text/html")) {
          throw new Error(
            `${path} returned HTML instead of Markdown. Check the file path and deployment configuration.`
          );
        }

        const text = await response.text();

        if (!text.trim()) {
          throw new Error(`${path} was loaded but is empty.`);
        }

        if (!cancelled) {
          cache.set(path, text);
          setRaw(text);
          setLoading(false);
        }
      } catch (err) {
        if (cancelled) return;

        const message =
          err instanceof Error ? err.message : "Unknown Markdown loading error";

        console.error(message);
        setRaw("");
        setError(message);
        setLoading(false);
      }
    };

    loadMarkdown();

    return () => {
      cancelled = true;
    };
  }, [path]);

  return { raw, loading, error };
}