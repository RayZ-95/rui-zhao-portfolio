"use client";

import { useEffect, useState } from "react";

type ResearchNavItem = {
  id: string;
  label: string;
};

export function ResearchNav({
  ariaLabel = "Page sections",
  compact = false,
  items,
  label = "On this page",
  plain = false,
  showLabel = true
}: {
  ariaLabel?: string;
  compact?: boolean;
  items: readonly ResearchNavItem[];
  label?: string;
  plain?: boolean;
  showLabel?: boolean;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -58% 0px",
        threshold: [0, 0.2, 0.5]
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [items]);

  function scrollToSection(id: string) {
    const target = document.getElementById(id);
    if (!target) return;

    setActiveId(id);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={
        compact
          ? "design-subnav design-subnav--compact"
          : plain
            ? "research-subnav research-subnav--plain"
            : "research-subnav"
      }
    >
      {showLabel ? <p className="research-subnav-label">{label}</p> : null}

      <ul className={compact ? "design-subnav-list" : "research-subnav-list"}>
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              className={
                compact
                  ? "design-subnav-link ui-button group"
                  : "ui-button group flex w-full items-start gap-2.5 px-3 py-2.5 text-left lg:gap-3 lg:px-4 lg:py-3"
              }
              data-active={activeId === item.id}
              onClick={() => scrollToSection(item.id)}
              type="button"
            >
              {compact ? null : (
                <span className="mt-0.5 shrink-0 text-[10px] tabular-nums text-[#aaa] group-data-[active=true]:text-[#666] lg:text-[11px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
              <span
                className={
                  compact
                    ? "design-subnav-text"
                    : "text-[11px] uppercase leading-snug text-[#444] group-data-[active=true]:text-[#111] md:text-[12px] lg:text-[13px]"
                }
              >
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
