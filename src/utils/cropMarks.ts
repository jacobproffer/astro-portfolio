import gsap from "gsap";

/**
 * Crop marks draw in on load: each crosshair spins a quarter turn into
 * place while its two hairlines grow out from the center. Timed to land
 * alongside the hero readout's boot-up.
 */
export function drawCropMarks() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const marks = document.querySelectorAll<HTMLElement>(
    "[data-crop-mark]:not([data-crop-done])",
  );
  if (!marks.length) return;
  marks.forEach((mark) => mark.setAttribute("data-crop-done", ""));

  const tl = gsap.timeline({ delay: 0.3 });
  marks.forEach((mark, i) => {
    const lines = mark.querySelectorAll("[data-crop-line]");
    const horizontal = lines[0];
    const vertical = lines[1];
    const at = i * 0.1;
    tl.set(mark, { opacity: 1 }, at)
      .from(
        mark.querySelector("[data-crop-rotor]"),
        { rotate: -90, duration: 0.9, ease: "expo.out" },
        at,
      )
      .from(horizontal, { scaleX: 0, duration: 0.7, ease: "expo.out" }, at)
      .from(vertical, { scaleY: 0, duration: 0.7, ease: "expo.out" }, at + 0.08);
  });
}
