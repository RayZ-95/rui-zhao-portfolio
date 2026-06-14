"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { homeIntroCopy } from "@/lib/content";
import { IntroUnicornBackground } from "@/components/IntroUnicornBackground";

export function HomeIntro({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const eyebrow = root.querySelector<HTMLElement>("[data-intro-eyebrow]");
    const prefix = root.querySelector<HTMLElement>("[data-intro-prefix]");
    const track = root.querySelector<HTMLElement>("[data-intro-track]");
    const tagline = root.querySelector<HTMLElement>("[data-intro-tagline]");
    const tags = gsap.utils.toArray<HTMLElement>("[data-intro-tag]", root);
    const scrollHint = root.querySelector<HTMLElement>("[data-intro-scroll]");
    const roleCount = homeIntroCopy.roles.length;

    const complete = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.85,
        ease: "power2.inOut",
        onComplete
      });
    };

    gsap.set([eyebrow, prefix, tagline, scrollHint, ...tags], { autoAlpha: 0, y: 16 });
    gsap.set(track, { yPercent: 0 });

    const introTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    introTimeline
      .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.15)
      .to(prefix, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.35)
      .to(tagline, { autoAlpha: 1, y: 0, duration: 0.7 }, 1.35)
      .to(tags, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, 1.55)
      .to(scrollHint, { autoAlpha: 1, y: 0, duration: 0.55 }, 1.85);

    const roleLoop = gsap.timeline({ repeat: -1, delay: 0.95 });
    const stepDuration = 0.55;
    const holdDuration = 0.42;
    const loopItemCount = roleCount + 1;
    const stepPct = -100 / loopItemCount;
    let time = 0;

    roleLoop.to({}, { duration: holdDuration }, time);
    time += holdDuration;

    for (let index = 1; index < loopItemCount; index += 1) {
      roleLoop.to(
        track,
        {
          yPercent: stepPct * index,
          duration: stepDuration,
          ease: "power3.inOut"
        },
        time
      );
      time += stepDuration;
      roleLoop.to({}, { duration: holdDuration }, time);
      time += holdDuration;
    }

    roleLoop.set(track, { yPercent: 0 }, time);

    const dismiss = () => {
      if (!completedRef.current && introTimeline.progress() > 0.35) {
        complete();
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > 8) dismiss();
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") dismiss();
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") dismiss();
    };

    const handleClick = () => dismiss();

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("click", handleClick);

    return () => {
      introTimeline.kill();
      roleLoop.kill();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("click", handleClick);
    };
  }, [onComplete]);

  return (
    <div aria-label="Introduction" className="home-intro" ref={rootRef}>
      <div className="home-intro__media" data-intro-video>
        <IntroUnicornBackground />
      </div>

      <div className="home-intro__inner">
        <p className="home-intro__eyebrow" data-intro-eyebrow>
          *{homeIntroCopy.name}*
        </p>

        <div className="home-intro__headline">
          <p className="home-intro__prefix" data-intro-prefix>
            {homeIntroCopy.prefix}
          </p>
          <div aria-live="polite" className="home-intro__role-mask">
            <div className="home-intro__role-track" data-intro-track>
              {homeIntroCopy.roles.map((role) => (
                <span key={role}>{role}</span>
              ))}
              <span aria-hidden="true">{homeIntroCopy.roles[0]}</span>
            </div>
          </div>
        </div>

        <p className="home-intro__tagline" data-intro-tagline>
          {homeIntroCopy.tagline}
        </p>

        <ul className="home-intro__tags">
          {homeIntroCopy.tags.map((tag) => (
            <li data-intro-tag key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <p className="home-intro__scroll" data-intro-scroll>
        Scroll
      </p>
    </div>
  );
}
