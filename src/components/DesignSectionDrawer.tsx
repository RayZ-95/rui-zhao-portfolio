"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type DesignNavItem = {
  id: string;
  label: string;
};

export function DesignSectionDrawer({ items }: { items: readonly DesignNavItem[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (items.length === 0) return;

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
    setOpen(false);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (items.length === 0 || !mounted) return null;

  return createPortal(
    <>
      {!open ? (
        <button
          aria-label="Open design sections"
          className="design-drawer-trigger"
          onClick={() => setOpen(true)}
          type="button"
        >
          <span className="design-drawer-trigger__icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      ) : null}

      {open ? (
        <>
          <div
            aria-hidden={false}
            className="design-drawer-backdrop design-drawer-backdrop--open"
            onClick={() => setOpen(false)}
          />

          <aside aria-hidden={false} className="design-drawer design-drawer--open">
            <div className="design-drawer__head">
              <p className="design-drawer__label">Design</p>
              <button
                aria-label="Close sections"
                className="design-drawer__close"
                onClick={() => setOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>

            <nav aria-label="Design sections">
              <ul className="design-drawer__list">
                {items.map((item, index) => (
                  <li key={item.id}>
                    <button
                      className="design-drawer__link"
                      data-active={activeId === item.id}
                      onClick={() => scrollToSection(item.id)}
                      type="button"
                    >
                      <span className="design-drawer__index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="design-drawer__text">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </>
      ) : null}
    </>,
    document.body
  );
}
