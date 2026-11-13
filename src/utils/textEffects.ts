import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const prefersReducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Character reveal for display headings.
 *
 * Markup: a `[data-split-group]` wrapper holding one `[data-split]` heading
 * and any `[data-split-meta]` labels. When the group scrolls in, the
 * heading's letters rise out of a mask one by one, then the labels fade in.
 * The split is reverted afterwards so the heading is plain text again; each
 * letter is first nudged onto its kerned position (see matchKerning) so that
 * revert doesn't visibly jump.
 *
 * global.css hides these elements up front (motion allowed only), so there
 * is no flash of the unsplit heading before this runs.
 */
export async function splitHeadings() {
  if (prefersReducedMotion()) return;

  // Split after the variable font loads, or the letter boxes are measured
  // against the fallback font.
  await document.fonts.ready;

  document
    .querySelectorAll<HTMLElement>("[data-split-group]:not([data-split-done])")
    .forEach((group) => {
      group.setAttribute("data-split-done", "");
      const heading = group.querySelector<HTMLElement>("[data-split]");
      if (!heading) return;
      const meta = group.querySelectorAll<HTMLElement>("[data-split-meta]");

      const kerned = glyphPositions(heading);

      // Words wrap the chars so lines never break mid-word.
      const split = SplitText.create(heading, {
        type: "words,chars",
        mask: "chars",
        charsClass: "split-char",
      });
      matchKerning(split.chars as HTMLElement[], kerned, heading);

      const tl = gsap.timeline({
        scrollTrigger: { trigger: group, start: "top 85%", once: true },
        onComplete: () => split.revert(),
      });

      tl.from(split.chars, {
        yPercent: 110,
        rotate: 8,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.03,
        // Write the hidden state now, not on the next tick, so there's no
        // frame where the heading is visible but the letters aren't offset.
        lazy: false,
      }).fromTo(
        meta,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 },
        0.3,
      );

      // The chars now hold the hidden state, so the heading itself can show.
      gsap.set(heading, { opacity: 1 });
    });
}

// No < or >: the plugin writes HTML, so they show up as escaped entities.
/** Left edge of every non-space character in `el`, as laid out unsplit. */
function glyphPositions(el: HTMLElement): number[] {
  const positions: number[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    for (let i = 0; i < node.length; i++) {
      if (/\s/.test(node.data[i])) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      positions.push(range.getBoundingClientRect().left);
    }
  }
  return positions;
}

/**
 * Splitting into one box per letter drops the font's kerning, so letters
 * drift from where they sit in the real text ("Stack" is off by ~23px at
 * desktop sizes, from the "ta" pair). Shift each letter's mask by margin so
 * it lands on its kerned position again. Corrections are applied in order
 * and re-measured, since each margin also moves the letters after it.
 */
function matchKerning(chars: HTMLElement[], kerned: number[], heading: HTMLElement) {
  if (chars.length !== kerned.length) return;
  // Kerning never moves a letter more than a fraction of an em. Anything
  // bigger means the split wrapped differently; leave that line alone.
  const limit = parseFloat(getComputedStyle(heading).fontSize) * 0.4;
  chars.forEach((char, i) => {
    const box = char.parentElement ?? char; // the mask, which isn't animated
    const delta = kerned[i] - box.getBoundingClientRect().left;
    if (Math.abs(delta) > 0.25 && Math.abs(delta) < limit) {
      box.style.marginLeft = `${(parseFloat(box.style.marginLeft) || 0) + delta}px`;
    }
  });
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_";

/**
 * "Boot-up" for `[data-readout]` spec lists: each row's key fades in, its
 * dotted leader draws across, and the value scrambles before resolving.
 * The values are monospace and keep their length while scrambling, so
 * nothing reflows.
 */
export function bootReadouts() {
  if (prefersReducedMotion()) return;

  document
    .querySelectorAll<HTMLElement>("[data-readout]:not([data-readout-done])")
    .forEach((list) => {
      list.setAttribute("data-readout-done", "");
      const tl = gsap.timeline({ delay: 0.5 });

      list.querySelectorAll<HTMLElement>(":scope > div").forEach((row, i) => {
        const key = row.querySelector("dt");
        const leader = row.querySelector(".leader");
        const value = row.querySelector("dd");
        const at = i * 0.12;

        if (key) tl.to(key, { opacity: 1, duration: 0.3 }, at);
        if (leader)
          tl.to(leader, { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, at);
        if (value)
          tl.set(value, { opacity: 1 }, at + 0.2).to(
            value,
            {
              duration: 0.9,
              ease: "none",
              scrambleText: {
                text: value.textContent ?? "",
                chars: SCRAMBLE_CHARS,
                revealDelay: 0.3,
                speed: 0.6,
              },
            },
            at + 0.2,
          );
      });
    });
}
