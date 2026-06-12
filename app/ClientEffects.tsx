"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import SplitType from "split-type";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ClientEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const splitTargets = document.querySelectorAll<HTMLElement>("[data-split]");
    const splits = Array.from(splitTargets).map((target) =>
      new SplitType(target, { types: "lines,words", lineClass: "split-line" }),
    );

    if (prefersReducedMotion) {
      return () => {
        splits.forEach((split) => split.revert());
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    }

    gsap.from(".hero .word", {
      yPercent: 115,
      rotateX: -35,
      opacity: 0,
      stagger: 0.018,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.15,
    });

    gsap.from(".hero-visual", {
      clipPath: "inset(10% 0 18% 0)",
      scale: 1.04,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 34,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 86%",
        },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((wrap) => {
      const items = wrap.querySelectorAll("[data-item]");
      gsap.from(items, {
        y: 34,
        opacity: 0,
        scale: 0.96,
        duration: 0.7,
        stagger: 0.075,
        ease: "power3.out",
        scrollTrigger: {
          trigger: wrap,
          start: "top 82%",
        },
      });
    });

    gsap.utils.toArray<HTMLElement>(".path-card").forEach((card, index) => {
      gsap.from(card, {
        x: index % 2 === 0 ? -42 : 42,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 84%",
        },
      });
    });

    gsap.from(".archive-head .word", {
      yPercent: 110,
      opacity: 0,
      stagger: 0.02,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".archive",
        start: "top 74%",
      },
    });

    const mm = gsap.matchMedia();

    mm.add("(min-width: 681px)", () => {
      const directions = [
        { x: -56, y: 34, rotation: -4 },
        { x: 24, y: 42, rotation: 3 },
        { x: 54, y: 28, rotation: 4 },
        { x: -42, y: 22, rotation: -3 },
        { x: 18, y: 38, rotation: 3 },
        { x: 46, y: 18, rotation: -3 },
      ];

      gsap.from("[data-dossier]", {
        x: (index) => directions[index % directions.length].x,
        y: (index) => directions[index % directions.length].y,
        rotation: (index) => directions[index % directions.length].rotation,
        scale: 0.92,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-archive]",
          start: "top 78%",
        },
      });
    });

    mm.add("(max-width: 680px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-dossier]").forEach((card) => {
        const innerItems = [
          card.querySelector(".clipboard-clip"),
          card.querySelector(".avatar-stamp"),
          card.querySelector(".dossier-top small"),
          card.querySelector(".dossier-top strong"),
          card.querySelector(".dossier-section:nth-of-type(1) span"),
          card.querySelector(".dossier-section:nth-of-type(1) p"),
          card.querySelector(".dossier-section:nth-of-type(2) span"),
          card.querySelector(".dossier-section:nth-of-type(2) p"),
          card.querySelector(".dossier-footer mark"),
          card.querySelector(".dossier-footer i"),
        ].filter(Boolean);

        gsap.set(innerItems, { autoAlpha: 0, y: 12 });

        const dossierReveal = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            once: true,
          },
        });

        dossierReveal
          .fromTo(
            card,
            {
              autoAlpha: 0,
              y: 56,
              rotation: prefersReducedMotion ? 0 : 1.5,
              scale: 0.97,
              filter: prefersReducedMotion ? "none" : "blur(6px)",
            },
            {
              autoAlpha: 1,
              y: 0,
              rotation: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: prefersReducedMotion ? 0.45 : 0.82,
              ease: "power3.out",
              overwrite: "auto",
            },
          )
          .to(
            innerItems,
            {
              autoAlpha: 1,
              y: 0,
              duration: prefersReducedMotion ? 0.28 : 0.42,
              stagger: prefersReducedMotion ? 0.03 : 0.065,
              ease: "power2.out",
            },
            "-=0.26",
          );
      });
    });

    mm.add("(min-width: 981px)", () => {
      const acts = gsap.utils.toArray<HTMLElement>("[data-act]");
      const cta = document.querySelector<HTMLElement>("[data-act-cta]");
      const hint = document.querySelector<HTMLElement>("[data-scroll-hint]");

      if (!acts.length || !cta) {
        return;
      }

      gsap.set(acts, {
        autoAlpha: 0,
        y: 84,
        scale: 0.9,
        rotation: (index) => (index % 2 === 0 ? -2 : 2),
      });
      gsap.set(acts[0], { autoAlpha: 1, y: 0, scale: 1, rotation: -0.7 });
      gsap.set(cta, { autoAlpha: 0, y: 24 });
      if (hint) {
        gsap.set(hint, { autoAlpha: 0, y: 8 });
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-cinematic]",
            start: "top 76%",
          },
        })
        .from(".cinematic-intro .kicker", { y: 14, autoAlpha: 0, duration: 0.42, ease: "power3.out" })
        .from(
          ".cinematic-intro .word",
          { yPercent: 105, autoAlpha: 0, stagger: 0.01, duration: 0.58, ease: "power3.out" },
          "-=0.2",
        )
        .from(".cinematic-intro p", { y: 18, autoAlpha: 0, duration: 0.48, ease: "power3.out" }, "-=0.22");

      const cinematic = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-cinematic]",
          start: "top -38%",
          end: "+=2400",
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
        },
      });

      cinematic.to(".cinematic-glow", { x: -90, y: -50, scale: 1.12, duration: 2.2, ease: "none" }, 0);
      if (hint) {
        cinematic.to(hint, { autoAlpha: 0.72, y: 0, duration: 0.12, ease: "power2.out" }, 0.05);
        cinematic.to(hint, { autoAlpha: 0, duration: 0.16, ease: "power2.out" }, 1.08);
      }

      acts.forEach((card, index) => {
        if (index === 0) {
          return;
        }

        const enterAt = 0.2 + (index - 1) * 0.36;
        cinematic.to(
          card,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: index % 2 === 0 ? -0.7 : 0.7,
            duration: 0.28,
            ease: "power3.out",
          },
          enterAt,
        );

        cinematic.to(
          acts[index - 1],
          { y: -86, scale: 0.92, autoAlpha: 0.25, duration: 0.28, ease: "power3.out" },
          enterAt + 0.08,
        );
      });

      cinematic.to(cta, { autoAlpha: 1, y: 0, duration: 0.24, ease: "power3.out" }, ">-=0.02");
    });

    mm.add("(min-width: 681px) and (max-width: 980px)", () => {
      const mobileActs = gsap.utils.toArray<HTMLElement>("[data-act]");

      gsap.from(".cinematic-intro .word", {
        yPercent: 110,
        autoAlpha: 0,
        stagger: 0.012,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cinematic",
          start: "top 78%",
        },
      });

      ScrollTrigger.batch("[data-act]", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 48, scale: 0.97, autoAlpha: 0 },
            { y: 0, scale: 1, autoAlpha: 1, duration: 0.65, stagger: 0.08, ease: "power3.out" },
          );
        },
      });

      const setActiveAct = (activeIndex: number) => {
        mobileActs.forEach((card, index) => {
          card.classList.toggle("is-mobile-active", index === activeIndex);
          card.classList.toggle("is-mobile-muted", index < activeIndex);
        });
      };

      mobileActs.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => setActiveAct(index),
          onEnterBack: () => setActiveAct(index),
        });
      });
    });

    mm.add("(max-width: 680px)", () => {
      const acts = gsap.utils.toArray<HTMLElement>("[data-act]");
      const cta = document.querySelector<HTMLElement>("[data-act-cta]");
      const hint = document.querySelector<HTMLElement>("[data-scroll-hint]");

      gsap.from(".cinematic-intro .word", {
        yPercent: 110,
        autoAlpha: 0,
        stagger: 0.012,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cinematic",
          start: "top 82%",
        },
      });

      if (!acts.length || !cta) {
        return;
      }

      gsap.set(acts, {
        autoAlpha: 0,
        y: 54,
        scale: 0.94,
        rotation: (index) => (index % 2 === 0 ? -1.2 : 1.2),
      });
      gsap.set(acts[0], { autoAlpha: 1, y: 0, scale: 1, rotation: -0.45 });
      gsap.set(cta, { autoAlpha: 0, y: 16 });
      if (hint) {
        gsap.set(hint, { autoAlpha: 0, y: 6 });
      }

      const mobileCinematic = gsap.timeline({
        scrollTrigger: {
          trigger: ".act-stage",
          start: "top 18%",
          end: "+=2100",
          scrub: 0.85,
          pin: "[data-cinematic]",
          anticipatePin: 1,
        },
      });

      if (hint) {
        mobileCinematic.to(hint, { autoAlpha: 0.7, y: 0, duration: 0.12, ease: "power2.out" }, 0.04);
        mobileCinematic.to(hint, { autoAlpha: 0, duration: 0.14, ease: "power2.out" }, 1.08);
      }

      acts.forEach((card, index) => {
        if (index === 0) {
          return;
        }

        const enterAt = 0.28 + (index - 1) * 0.34;
        mobileCinematic.to(
          card,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: index % 2 === 0 ? -0.45 : 0.45,
            duration: 0.28,
            ease: "power3.out",
          },
          enterAt,
        );
        mobileCinematic.to(
          acts[index - 1],
          { y: -46, scale: 0.94, autoAlpha: 0.22, duration: 0.28, ease: "power3.out" },
          enterAt + 0.08,
        );
      });

      mobileCinematic.to(cta, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power3.out" }, ">-=0.02");
    });

    gsap.from(".route-head .word", {
      yPercent: 110,
      autoAlpha: 0,
      stagger: 0.014,
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".route-section",
        start: "top 72%",
      },
    });

    gsap.utils.toArray<SVGPathElement>("[data-route-path]").forEach((pathEl) => {
      const length = pathEl.getTotalLength();
      gsap.set(pathEl, { autoAlpha: 1, strokeDasharray: length, strokeDashoffset: length });
      gsap.to(pathEl, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-route-map]",
          start: "top 72%",
          end: "bottom 64%",
          scrub: 0.9,
        },
      });
    });

    gsap.from("[data-route-start]", {
      y: 22,
      autoAlpha: 0,
      scale: 0.94,
      duration: 0.55,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "[data-route-map]",
        start: "top 78%",
      },
    });

    gsap.utils.toArray<HTMLElement>("[data-route-card]").forEach((card) => {
      const dot = card.querySelector("[data-route-dot]");
      const content = card.querySelector("[data-route-content]");
      const tasks = card.querySelectorAll("[data-route-task]");
      const copy = card.querySelector("p");
      const introItems = Array.from(content?.children ?? []).filter(
        (child) => !child.classList.contains("route-tasks") && child.tagName.toLowerCase() !== "p",
      );

      const routeCard = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 78%",
        },
      });

      routeCard
        .fromTo(dot, { autoAlpha: 0, scale: 0.45 }, { autoAlpha: 1, scale: 1, duration: 0.28, ease: "power3.out" })
        .fromTo(
          card,
          { y: 40, scale: 0.95, autoAlpha: 0 },
          { y: 0, scale: 1, autoAlpha: 1, duration: 0.62, ease: "power3.out" },
          "-=0.12",
        )
        .from(introItems, { y: 18, autoAlpha: 0, stagger: 0.055, duration: 0.42, ease: "power3.out" }, "-=0.26");

      if (tasks.length) {
        routeCard.from(tasks, { y: 12, autoAlpha: 0, stagger: 0.08, duration: 0.34, ease: "power3.out" }, "-=0.12");
      }

      if (copy) {
        routeCard.from(copy, { y: 14, autoAlpha: 0, duration: 0.42, ease: "power3.out" }, tasks.length ? "-=0.02" : "-=0.18");
      }
    });

    gsap.from("[data-route-next]", {
      y: 24,
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.62,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "[data-route-next]",
        start: "top 86%",
      },
    });

    const host = gsap.timeline({
      scrollTrigger: {
        trigger: ".expert-section",
        start: "top 72%",
      },
    });

    host
      .from("[data-host-photo]", {
        autoAlpha: 0,
        scale: 0.94,
        y: 34,
        clipPath: "inset(10% 8% 12% 8% round 30px)",
        duration: 0.9,
        ease: "power3.out",
      })
      .from(
        ".expert-section .word",
        { yPercent: 110, autoAlpha: 0, stagger: 0.02, duration: 0.65, ease: "power3.out" },
        "-=0.2",
      )
      .from(".host-copy p", { y: 22, autoAlpha: 0, duration: 0.55, ease: "power3.out" }, "-=0.28")
      .fromTo(
        "[data-host-facts] span",
        {
          x: (index) => (index % 2 === 0 ? -24 : 24),
          y: 28,
          autoAlpha: 0,
          scale: 0.96,
          rotateX: -10,
        },
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          scale: 1,
          rotateX: 0,
          stagger: 0.12,
          duration: 0.54,
          ease: "power3.out",
        },
        "+=0.04",
      );

    const support = gsap.timeline({
      scrollTrigger: {
        trigger: "[data-support]",
        start: "top 72%",
        once: true,
      },
    });

    support
      .from(".support-copy .kicker", { y: 18, autoAlpha: 0, duration: 0.45, ease: "power3.out" })
      .from(".support-copy h2", { y: 26, autoAlpha: 0, duration: 0.55, ease: "power3.out" }, "-=0.22")
      .from(".support-copy p", { y: 18, autoAlpha: 0, duration: 0.45, ease: "power3.out" }, "-=0.24")
      .from(".support-actions a", { y: 18, autoAlpha: 0, stagger: 0.06, duration: 0.42, ease: "power3.out" }, "-=0.16")
      .from(".support-phone-wrap img", { y: 38, scale: 0.94, autoAlpha: 0, duration: 0.76, ease: "power3.out" }, "-=0.26");

    gsap.utils.toArray<HTMLElement>("[data-question]").forEach((question, index) => {
      support
        .fromTo(
          question,
          { y: 18, autoAlpha: 0, scale: 0.96 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.3, ease: "power3.out" },
          index === 0 ? "+=0.04" : "+=0.02",
        )
        .to(question, {
          x: index === 2 ? -88 : 132,
          y: [-24, 4, -10][index] ?? 0,
          scale: 0.76,
          autoAlpha: 0,
          duration: 0.54,
          ease: "power3.inOut",
        });
    });

    support.from(
      ".ambient-questions span",
      { autoAlpha: 0, y: 18, stagger: 0.06, duration: 0.8, ease: "power2.out" },
      "-=0.08",
    );

    mm.add("(min-width: 981px)", () => {
      const buttons = gsap.utils.toArray<HTMLElement>(".tariff-card .btn, .tariff-card .gc-widget-slot");
      const cleanups: Array<() => void> = [];

      buttons.forEach((button) => {
        const xTo = gsap.quickTo(button, "x", { duration: 0.28, ease: "power3.out" });
        const yTo = gsap.quickTo(button, "y", { duration: 0.28, ease: "power3.out" });

        const handleMove = (event: MouseEvent) => {
          const rect = button.getBoundingClientRect();
          const relX = event.clientX - rect.left - rect.width / 2;
          const relY = event.clientY - rect.top - rect.height / 2;
          xTo(relX * 0.06);
          yTo(relY * 0.08);
        };

        const handleLeave = () => {
          xTo(0);
          yTo(0);
        };

        button.addEventListener("mousemove", handleMove);
        button.addEventListener("mouseleave", handleLeave);
        cleanups.push(() => {
          button.removeEventListener("mousemove", handleMove);
          button.removeEventListener("mouseleave", handleLeave);
        });
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    });

    gsap.to(".hero-art", {
      yPercent: 7,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(".orbit", {
      rotate: 360,
      duration: 26,
      ease: "none",
      repeat: -1,
    });

    return () => {
      splits.forEach((split) => split.revert());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      mm.revert();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
