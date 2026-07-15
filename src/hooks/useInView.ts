import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefCallback,
} from "react";

export function useInView(
  threshold = 0.12
): [RefCallback<HTMLElement>, boolean] {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isInView, setIsInView] = useState(false);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);

            // Stop observing once the animation has triggered.
            observerRef.current?.disconnect();
            observerRef.current = null;
          }
        },
        { threshold }
      );

      observerRef.current.observe(node);
    },
    [threshold]
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return [ref, isInView];
}