import { animate, stagger, spring, inView } from "motion";
import type { AnimationOptions } from "motion";

// Motion One's strict types don't support all CSS properties and easing functions,
// so we extend the base type to allow flexibility while maintaining some type safety
type Keyframes = Record<string, unknown>;
type ExtendedAnimationOptions = Partial<
  AnimationOptions & { easing?: unknown; delay?: unknown }
>;

/**
 * Fade in animation
 */
export function fadeIn(
  element: Element,
  options: ExtendedAnimationOptions = {},
) {
  return animate(
    element,
    {
      opacity: [0, 1],
      transform: ["translateY(20px)", "translateY(0px)"],
    } as Keyframes,
    { duration: 0.6, easing: spring(), ...options },
  );
}

/**
 * Fade in elements with stagger effect
 */
export function fadeInStagger(
  selector: string,
  options: ExtendedAnimationOptions = {},
) {
  const elements = document.querySelectorAll(selector);
  return animate(
    elements as any,
    {
      opacity: [0, 1],
      transform: ["translateY(20px)", "translateY(0px)"],
    } as Keyframes,
    { delay: stagger(0.1), duration: 0.6, easing: spring(), ...options },
  );
}

/**
 * Animate on scroll into view
 */
export function animateOnScroll(
  element: Element,
  animation: Keyframes = {
    opacity: [0, 1],
    transform: ["translateY(40px)", "translateY(0px)"],
  },
  options: ExtendedAnimationOptions = {},
) {
  // Skip if already animated
  if (element.hasAttribute("data-animated")) return;

  return inView(
    element,
    () => {
      // Mark as animated to prevent re-triggering
      element.setAttribute("data-animated", "true");
      animate(element, animation as Keyframes, {
        duration: 0.8,
        easing: spring(),
        ...options,
      });
    },
    { amount: 0.3 },
  );
}

/**
 * Scale animation
 */
export function scaleIn(
  element: Element,
  options: ExtendedAnimationOptions = {},
) {
  return animate(element, { scale: [0.9, 1], opacity: [0, 1] } as Keyframes, {
    duration: 0.5,
    easing: spring(),
    ...options,
  });
}
