import { animate, stagger, spring, inView } from "motion";
import type { AnimationOptions } from "motion";

/**
 * Fade in animation
 */
export function fadeIn(element: Element, options: any = {}) {
  return animate(
    element,
    {
      opacity: [0, 1],
      transform: ["translateY(20px)", "translateY(0px)"],
    } as any,
    { duration: 0.6, easing: spring(), ...options } as any,
  );
}

/**
 * Fade in elements with stagger effect
 */
export function fadeInStagger(selector: string, options: any = {}) {
  const elements = document.querySelectorAll(selector);
  return animate(
    elements,
    {
      opacity: [0, 1],
      transform: ["translateY(20px)", "translateY(0px)"],
    } as any,
    { delay: stagger(0.1), duration: 0.6, easing: spring(), ...options } as any,
  );
}

/**
 * Animate on scroll into view
 */
export function animateOnScroll(
  element: Element,
  animation: any = {
    opacity: [0, 1],
    transform: ["translateY(40px)", "translateY(0px)"],
  },
  options: any = {},
) {
  // Skip if already animated
  if (element.hasAttribute("data-animated")) return;

  return inView(
    element,
    () => {
      // Mark as animated to prevent re-triggering
      element.setAttribute("data-animated", "true");
      animate(
        element,
        animation as any,
        {
          duration: 0.8,
          easing: spring(),
          ...options,
        } as any,
      );
    },
    { amount: 0.3 },
  );
}

/**
 * Scale animation
 */
export function scaleIn(element: Element, options: any = {}) {
  return animate(
    element,
    { scale: [0.9, 1], opacity: [0, 1] } as any,
    {
      duration: 0.5,
      easing: spring(),
      ...options,
    } as any,
  );
}
