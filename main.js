// Wait until the full DOM is loaded before running scripts
window.addEventListener("DOMContentLoaded", () => {
  // Register ScrollTrigger plugin from GSAP
  gsap.registerPlugin(ScrollTrigger);

  const header = document.querySelector("header");

  // Brand colour token, read from the stylesheet so the palette only ever
  // lives in one place.
  const css = getComputedStyle(document.documentElement);
  const GOLD = css.getPropertyValue("--gold").trim() || "#e8b74a";

  // ==========================
  // Mobile Menu Toggle
  // ==========================

  // Toggles mobile nav visibility on hamburger click
  function toggleMobileNav() {
    document.getElementById("mobileMenu").classList.toggle("show");
  }

  // Expose function globally to use in inline HTML
  window.toggleMobileNav = toggleMobileNav;

  // Close the mobile menu after a link is tapped
  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () =>
      document.getElementById("mobileMenu").classList.remove("show")
    );
  });

  // ==========================
  // Initial Page Load Animations
  // ==========================

  function runInitialAnimations() {
    // Everything below is expressed in seconds and then scaled by HERO_SPEED.
    // Raise it to make the intro snappier, lower it to slow the whole thing
    // down — one number, no need to touch the individual tweens.
    const HERO_SPEED = 1;

    // Respect the OS "reduce motion" setting: jump straight to the end state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set("header", { "--border-width": "100%" });
      gsap.set(".social-sidebar", { "--border-height": "100%" });
      gsap.set(".hero-content h1", {
        opacity: 1,
        color: GOLD,
        "-webkit-text-stroke": "0px " + GOLD,
      });
      gsap.set(".hero-bottle-wrapper", { opacity: 1 });
      gsap.set(".hero-stamp", { opacity: 1, scale: 1 });
      return;
    }

    // Create a timeline with a single gentle default ease. Every tween below
    // overlaps its neighbours — nothing waits for the previous step to finish,
    // which is what makes the intro read as one continuous move rather than a
    // sequence of separate pops.
    const onLoadTl = gsap.timeline({
      defaults: { ease: "power2.out", duration: 1.2 },
    });
    onLoadTl.timeScale(HERO_SPEED);

    onLoadTl
      // Hairlines draw in slowly underneath everything else
      .to("header", { "--border-width": "100%", duration: 2.2, ease: "power1.inOut" }, 0)
      .to(".social-sidebar", { "--border-height": "100%", duration: 3, ease: "power1.inOut" }, 0)

      // Logo lockup settles first
      .from(".logo-np, .logo-en", { y: 18, opacity: 0, duration: 1.1, stagger: 0.13 }, 0)

      // Nav links and sidebar icons drift down into place
      .from(
        ".desktop-nav a, .social-sidebar a",
        { y: -34, opacity: 0, duration: 1.1, stagger: 0.1, ease: "power3.out" },
        0.05
      )

      // Hero wordmark: fades up as an outline, then the gold fill bleeds in
      .to(".hero-content h1", { opacity: 1, duration: 1 }, 0.1)
      .from(
        ".hero-content .line",
        { x: 64, opacity: 0, duration: 1.4, stagger: 0.16, ease: "power3.out" },
        0.15
      )
      .to(
        ".hero-content h1",
        {
          color: GOLD,
          "-webkit-text-stroke": "0px " + GOLD,
          duration: 1.5,
          ease: "power1.inOut",
        },
        0.45
      )

      // Bottle eases in slightly oversized and settles
      .fromTo(
        ".hero-bottle-wrapper",
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 2, ease: "power2.out" },
        0.3
      )

      // Seal presses down — softened so it lands rather than snapping
      .to(
        ".hero-stamp",
        { opacity: 1, scale: 1, duration: 1.1, ease: "back.out(1.4)" },
        0.9
      )
      // A faint shudder on contact
      .to(
        ".hero-stamp",
        { y: "+=4", x: "-=2", repeat: 2, yoyo: true, duration: 0.07, ease: "sine.inOut" },
        1.85
      )

      // Tagline and scroll cue trail the wordmark
      .from(".hero-tagline", { y: 18, opacity: 0, duration: 1.2 }, 1.2)
      .from(".scroll-cue", { y: 14, opacity: 0, duration: 1.1 }, 1.5);
  }

  // ==========================
  // Reusable Scroll-Based Animation Setup
  // ==========================

  function pinAndAnimate({
    trigger,
    endTrigger,
    end,
    pin,
    animations,
    markers = false,
    headerOffset = 0,
  }) {
    // Create a GSAP timeline connected to ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: `top top+=${headerOffset}`,
        endTrigger,
        // Default: run until the end trigger reaches the top of the viewport
        end: end || `top top+=${headerOffset}`,
        // A number instead of `true` gives the bottle that many seconds to
        // catch up to the scroll position. This is the single biggest thing
        // separating "glued to the wheel" from "gliding" — raise it for more
        // float, drop toward 0 for a tighter, more literal follow.
        scrub: 1.1,
        pin,
        pinSpacing: false,
        markers: markers, // for debugging
        invalidateOnRefresh: true, // ensures recalculation on resize
      },
    });

    // Loop through each animation object
    animations.forEach(({ target, vars, position = 0 }) => {
      tl.to(target, vars, position);
    });
  }

  // ==========================
  // Scroll Reveals (content sections)
  // ==========================

  function setupReveals() {
    const reveal = (target, opts = {}) => {
      const { triggerEl, ...vars } = opts;
      gsap.from(target, {
        y: 44,
        opacity: 0,
        duration: 1.4,
        ease: "power2.out",
        ...vars,
        scrollTrigger: {
          trigger: triggerEl || target,
          start: "top 88%",
          once: true,
        },
      });
    };

    // Intro column
    reveal(".intro-left .small-title");
    reveal(".intro-left .main-heading", { delay: 0.08 });
    reveal(".intro-left .description", { delay: 0.14 });
    reveal(".stat-row .stat", { stagger: 0.12, triggerEl: ".stat-row" });
    reveal(".intro-left .cta-box", { delay: 0.2 });

    // Closing section
    reveal(".outro .small-title");
    reveal(".outro-heading", { delay: 0.08 });
    reveal(".outro-sub", { delay: 0.14 });
    reveal(".outro .description", { delay: 0.2 });
    reveal(".outro .cta-box", { delay: 0.26 });

    // Ingredients ledger
    reveal(".ingredients-title");
    reveal(".ingredient-item", {
      x: 30,
      y: 0,
      stagger: 0.1,
      triggerEl: ".ingredients-log",
    });

    // Heritage headline — the outlined type fills in as it enters
    gsap.to(".timeline-main-title", {
      color: GOLD,
      "-webkit-text-stroke": "0px " + GOLD,
      duration: 1.8,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".timeline-main-title",
        start: "top 78%",
        once: true,
      },
    });

    // Each heritage entry
    document.querySelectorAll(".timeline-entry").forEach((entry) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: entry, start: "top 72%", once: true },
      });

      tl.to(entry.querySelector(".timeline-date"), {
        y: 0,
        duration: 1.4,
        ease: "power2.out",
      })
        .from(
          entry.querySelector(".timeline-img"),
          { y: 56, opacity: 0, duration: 1.5, ease: "power2.out" },
          0.12
        )
        .from(
          entry.querySelectorAll(".timeline-title, .timeline-description"),
          {
            y: 34,
            opacity: 0,
            duration: 1.3,
            stagger: 0.18,
            ease: "power2.out",
          },
          0.2
        );
    });
  }

  // ==========================
  // ScrollTrigger Configurations for Desktop & Mobile
  // ==========================

  function setupScrollAnimations() {
    const headerOffset = header.offsetHeight - 1;

    // Use matchMedia to handle responsive behaviors
    ScrollTrigger.matchMedia({
      // Desktop scroll animations
      "(min-width: 769px)": function () {
        // 1. Bottle straightens up as it leaves the hero
        pinAndAnimate({
          trigger: ".hero",
          endTrigger: ".section-intro",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 0, scale: 0.8 } },
          ],
          headerOffset,
        });

        // 2. Bottle drifts right across the brew section
        pinAndAnimate({
          trigger: ".section-intro",
          endTrigger: ".timeline-entry.entry-1",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 10, scale: 0.7 } },
            { target: ".hero-bottle-wrapper", vars: { x: "30%" } },
          ],
          headerOffset,
        });

        // 3. Bottle swings left through the 1989 chapter
        pinAndAnimate({
          trigger: ".timeline-entry.entry-1",
          endTrigger: ".timeline-entry.entry-2",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: -10, scale: 0.7 } },
            { target: ".hero-bottle-wrapper", vars: { x: "-25%" } },
          ],
          headerOffset,
        });

        // 4. Bottle swings back right through the 2007 chapter
        pinAndAnimate({
          trigger: ".timeline-entry.entry-2",
          endTrigger: ".timeline-entry.entry-3",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 8, scale: 0.66 } },
            { target: ".hero-bottle-wrapper", vars: { x: "28%" } },
          ],
          headerOffset,
        });

        // 5. Bottle centres and fades out into the closing section
        pinAndAnimate({
          trigger: ".timeline-entry.entry-3",
          endTrigger: ".outro",
          pin: ".hero-bottle-wrapper",
          animations: [
            {
              target: ".hero-bottle",
              vars: { rotate: 0, scale: 0.5, opacity: 0 },
            },
            { target: ".hero-bottle-wrapper", vars: { x: "0%" } },
          ],
          headerOffset,
        });
      },

      // Mobile fallback animation (no scroll-based logic)
      "(max-width: 768px)": function () {
        gsap.to(".hero-bottle-wrapper", {
          opacity: 1,
          duration: 1,
          delay: 0.5,
        });
      },
    });
  }

  // ==========================
  // Init Everything on Load
  // ==========================

  runInitialAnimations(); // Load-in animations
  setupReveals(); // Section reveals
  setupScrollAnimations(); // Scroll-based bottle choreography

  // Final recalculation for all ScrollTriggers
  ScrollTrigger.refresh();

  // Fonts change layout heights — recalculate once they have landed
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
});
