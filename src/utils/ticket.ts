import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The experience ticket "prints": the acid paper feeds out top to bottom,
 * then the stub labels stamp on. The record rows inside reveal on their
 * own as they scroll in (see Experience.astro), since the ticket can be
 * several viewports tall.
 *
 * global.css clips the ticket up front when motion is allowed.
 */
export function printTicket(ticket: HTMLElement) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const stubs = ticket.querySelectorAll("[data-ticket-stub]");

  gsap
    .timeline({
      // As soon as its top edge shows: the ticket is taller than the screen.
      scrollTrigger: { trigger: ticket, start: "top 90%", once: true },
    })
    .fromTo(
      ticket,
      { clipPath: "inset(0rem -2rem 100% -2rem)" },
      {
        clipPath: "inset(0rem -2rem 0% -2rem)",
        duration: 1.4,
        ease: "power3.inOut",
      },
    )
    // Not clearProps: removing the inline value would hand control back to
    // the clipped starting state in global.css.
    .set(ticket, { clipPath: "none" })
    .fromTo(
      stubs,
      { opacity: 0, scale: 1.3 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.12 },
      0.5,
    );
}
