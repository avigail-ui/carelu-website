import { useEffect } from 'react';

/**
 * Scroll-triggered reveal animations.
 * Add className="reveal" to any element that should animate in on scroll.
 * Add className="reveal d1" through "d5" for staggered delays.
 * Call this hook once in the page root component.
 */
export function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const observeAll = () =>
      document.querySelectorAll('.rv, .rv-scale, .rv-left, .rv-right, .step-divider').forEach((el) => observer.observe(el));
    observeAll();

    // Re-scan when React swaps subtrees (e.g. responsive layout branches) so
    // late-mounted reveal elements don't stay stuck at opacity 0.
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { observer.disconnect(); mo.disconnect(); };
  }, []);
}
