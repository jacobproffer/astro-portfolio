import gsap from "gsap";

/**
 * Work list hover preview, ported from the myles-portfolio work index.
 *
 * A thumbnail card trails the cursor, tilts with horizontal velocity and
 * scales in/out as the pointer enters and leaves rows. Hit-testing runs on
 * scroll as well as pointer move, because scrolling slides rows out from
 * under a still cursor without firing any pointerenter/leave events.
 *
 * Only runs with a fine pointer and motion allowed; otherwise the rows keep
 * their inline thumbnails (the `preview:` variant never activates).
 */
export function workPreview(section: HTMLElement) {
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const preview = section.querySelector<HTMLElement>("[data-preview]");
  const label = section.querySelector<HTMLElement>("[data-preview-label]");
  const slides = Array.from(
    section.querySelectorAll<HTMLElement>("[data-preview-slide]"),
  );
  if (!finePointer || reduced || !preview || !slides.length) return;

  section.setAttribute("data-preview-ready", "");

  // Thumbnails are lazy and the card starts hidden, so they'd never load on
  // their own. Pull them in the first time the pointer nears the list.
  section.addEventListener(
    "pointerenter",
    () =>
      section
        .querySelectorAll<HTMLImageElement>("[data-preview-slide] img")
        .forEach((img) => (img.loading = "eager")),
    { once: true },
  );

  gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
  const xTo = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3" });
  const yTo = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3" });
  const rTo = gsap.quickTo(preview, "rotate", { duration: 0.8, ease: "power3" });

  let px = -1;
  let py = -1;
  let lastX = 0;
  let current: HTMLElement | null = null;
  let z = 1;

  // Tilt from per-frame horizontal velocity, so it settles back to 0 when the
  // pointer stops instead of freezing at the last move's angle.
  const tilt = () => {
    rTo(gsap.utils.clamp(-14, 14, (px - lastX) * 0.6));
    lastX = px;
  };

  const reveal = (slide: HTMLElement) => {
    gsap.set(slide, { zIndex: ++z });
    gsap.fromTo(
      slide,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.out", overwrite: "auto" },
    );
    gsap.fromTo(
      slide.querySelector("img"),
      { scale: 1.4 },
      { scale: 1.1, duration: 1.2, ease: "expo.out", overwrite: "auto" },
    );
    if (label) label.textContent = slide.dataset.label ?? "";
  };

  const sync = () => {
    const hit = px < 0 ? null : document.elementFromPoint(px, py);
    const row = hit?.closest<HTMLElement>("[data-work-row]") ?? null;
    if (row === current) return;
    const wasVisible = !!current;
    current = row;

    if (row) {
      const slide = slides[Number(row.dataset.index)];
      if (slide) reveal(slide);
      if (!wasVisible) {
        // Jump to the cursor rather than flying in from the last exit point.
        gsap.set(preview, { x: px, y: py, rotate: 0 });
        xTo(px, px);
        yTo(py, py);
        lastX = px;
        gsap.ticker.add(tilt);
      }
      gsap.to(preview, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "expo.out", overwrite: "auto" });
    } else {
      gsap.ticker.remove(tilt);
      rTo(0);
      gsap.to(preview, { scale: 0, autoAlpha: 0, duration: 0.5, ease: "expo.out", overwrite: "auto" });
    }
  };

  window.addEventListener("pointermove", (e) => {
    px = e.clientX;
    py = e.clientY;
    xTo(px);
    yTo(py);
    sync();
  });
  window.addEventListener("scroll", sync, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => {
    px = py = -1;
    sync();
  });
}
