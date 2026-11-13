import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** How fast the paper feeds out, so tall (mobile) tickets don't race. */
const FEED_SPEED = 1100; // px per second
const MIN_FEED = 0.7;
const MAX_FEED = 1.4;
/** Let the paper get this far into an item before its text lands. */
const LEAD_IN = 24; // px

/**
 * The experience ticket "prints" as one sequence: the acid paper feeds out
 * top to bottom, and every record row and stub label lands the moment the
 * paper's edge reaches it, so text never appears on blank or unprinted paper.
 *
 * global.css hides the ticket (clipped), its rows and its stubs up front
 * when motion is allowed.
 */
export function printTicket(ticket: HTMLElement) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  ScrollTrigger.create({
    trigger: ticket,
    start: "top 75%",
    once: true,
    // Measure at trigger time, when fonts and layout have settled.
    onEnter: () => play(ticket),
  });
}

function play(ticket: HTMLElement) {
  const height = ticket.offsetHeight;
  const duration = gsap.utils.clamp(MIN_FEED, MAX_FEED, height / FEED_SPEED);
  const top = ticket.getBoundingClientRect().top;

  // When the paper's edge reaches `y` px down the ticket. Inverts power1.out
  // (progress = 1 - (1 - t)^2), the ease used for the feed below.
  const reaches = (y: number) => {
    const p = gsap.utils.clamp(0, 1, (y + LEAD_IN) / height);
    return duration * (1 - Math.sqrt(1 - p));
  };
  const offset = (el: Element) => el.getBoundingClientRect().top - top;

  const tl = gsap.timeline();

  tl.fromTo(
    ticket,
    { clipPath: `inset(0px -2rem ${height}px -2rem)` },
    { clipPath: "inset(0px -2rem 0px -2rem)", duration, ease: "power1.out" },
  )
    // Not clearProps: removing the inline value would hand control back to
    // the clipped starting state in global.css.
    .set(ticket, { clipPath: "none" });

  ticket.querySelectorAll(".ticket-row").forEach((row) => {
    tl.fromTo(
      row,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", clearProps: "transform" },
      reaches(offset(row)),
    );
  });

  ticket.querySelectorAll("[data-ticket-stub]").forEach((stub) => {
    tl.fromTo(
      stub,
      { opacity: 0, scale: 1.3 },
      { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" },
      reaches(offset(stub)),
    );
  });
}
