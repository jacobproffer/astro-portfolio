import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  /** ScrollTrigger start. Use "top bottom" for elements that can be taller
   * than the viewport, so they trigger as soon as any part shows. */
  start?: string;
  /** Delay between elements that enter the viewport together. */
  stagger?: number;
  /** Wait before each batch starts, e.g. to follow a parent's entrance. */
  delay?: number;
}

/**
 * Fade and lift `[data-animate]` elements in as they scroll into view.
 *
 * Batched, so elements that enter on the same frame (a page load, a fast
 * scroll) stagger in order instead of all popping at once. Runs once per
 * element. With reduced motion it does nothing: the CSS in global.css
 * already shows `[data-animate]` content in that case.
 */
export function reveal(
  targets: string | Element[],
  { start = "top 90%", stagger = 0.08, delay = 0 }: RevealOptions = {},
) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  ScrollTrigger.batch(targets, {
    start,
    once: true,
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          stagger,
          delay,
          clearProps: "transform",
        },
      ),
  });
}
