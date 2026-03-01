import { useEffect, useRef } from 'react';

/**
 * useScrollAnimation
 * 
 * Attaches an IntersectionObserver to a ref element.
 * When the element enters the viewport, adds the 'animate-in' class.
 * 
 * @param {Object}  options
 * @param {number}  options.threshold  - 0..1, default 0.12
 * @param {string}  options.rootMargin - default '0px 0px -60px 0px'
 * @param {boolean} options.once       - only animate once (default true)
 * @returns React ref to attach to the element
 */
export function useScrollAnimation({
    threshold = 0.12,
    rootMargin = '0px 0px -60px 0px',
    once = true,
} = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Respect user's reduced-motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.classList.add('animate-in');
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('animate-in');
                    if (once) observer.disconnect();
                } else if (!once) {
                    el.classList.remove('animate-in');
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return ref;
}

/**
 * useStaggeredScrollAnimation
 * 
 * Applies staggered scroll animations to a list of child elements
 * inside a container ref.
 * 
 * @param {string} childSelector - CSS selector for children, default '.stagger-item'
 * @param {number} staggerMs     - delay increment per child in ms, default 80
 */
export function useStaggeredScrollAnimation(childSelector = '.stagger-item', staggerMs = 80) {
    const ref = useRef(null);

    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            container.querySelectorAll(childSelector).forEach(el => el.classList.add('animate-in'));
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const children = container.querySelectorAll(childSelector);
                    children.forEach((child, i) => {
                        setTimeout(() => child.classList.add('animate-in'), i * staggerMs);
                    });
                    observer.disconnect();
                }
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, [childSelector, staggerMs]);

    return ref;
}
