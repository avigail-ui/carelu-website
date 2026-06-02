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

    const selector = '.rv, .rv-scale, .rv-left, .rv-right, .step-divider';
    const observeAll = () => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.classList.contains('visible')) observer.observe(el);
      });
    };

    observeAll();
    // Re-observe whenever new matching elements get added (lazy-mounted sections, etc.)
    const mut = new MutationObserver(observeAll);
    mut.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mut.disconnect();
    };
  }, []);
}
