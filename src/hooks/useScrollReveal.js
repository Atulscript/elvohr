import { useEffect } from 'react';

/**
 * Hook to automatically observe elements with '.reveal-on-scroll'
 * and add '.is-visible' when they enter the viewport.
 * Uses MutationObserver so lazy-loaded route components are seamlessly observed.
 */
export const useScrollReveal = (deps = []) => {
  useEffect(() => {
    // Respect user's reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    const observedSet = new WeakSet();

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08,
      }
    );

    const observeNewElements = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
      elements.forEach((el) => {
        if (!observedSet.has(el)) {
          observedSet.add(el);
          intersectionObserver.observe(el);
        }
      });
    };

    // Initial check
    observeNewElements();

    // Listen for DOM changes (lazy-loaded pages, route transitions, etc.)
    const mutationObserver = new MutationObserver(() => {
      observeNewElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, deps);
};

export default useScrollReveal;
