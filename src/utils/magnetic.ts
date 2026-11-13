import gsap from "gsap";

/**
 * `[data-magnetic]` elements lean toward the cursor while it's over them
 * and spring back when it leaves. Kept to a couple of primary calls to
 * action on purpose. Fine pointers only, and off with reduced motion.
 */
export function magnetic(strength = 0.25, maxPull = 12) {
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reduced) return;
  // The pull scales with the element's size, so cap it: a wide link like
  // the footer email would otherwise drift 60px+.
  const cap = gsap.utils.clamp(-maxPull, maxPull);

  document
    .querySelectorAll<HTMLElement>("[data-magnetic]:not([data-magnetic-ready])")
    .forEach((el) => {
      el.setAttribute("data-magnetic-ready", "");
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });

      el.addEventListener("pointermove", (e) => {
        // Measure without the current offset, so the pull doesn't feed back.
        const r = el.getBoundingClientRect();
        const cx = r.left - (gsap.getProperty(el, "x") as number) + r.width / 2;
        const cy = r.top - (gsap.getProperty(el, "y") as number) + r.height / 2;
        xTo(cap((e.clientX - cx) * strength));
        yTo(cap((e.clientY - cy) * strength));
      });
      el.addEventListener("pointerleave", () => {
        xTo(0);
        yTo(0);
      });
    });
}
