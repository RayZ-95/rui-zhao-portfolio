"use client";

import { encodePublicAssetPath } from "@/lib/content";
import { useEffect, useRef } from "react";

function StripImage({
  alt,
  className,
  imageClassName = "master-strip__img",
  src
}: {
  alt: string;
  className?: string;
  imageClassName?: string;
  src: string;
}) {
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={alt} className={imageClassName} draggable={false} src={encodePublicAssetPath(src)} />
    </figure>
  );
}

export function MasterStripLayout({
  description,
  heroImages,
  keywordList,
  largeSansTitle = false,
  portfolioImages = [],
  section,
  title,
  year
}: {
  description: string;
  heroImages: string[];
  keywordList: string;
  largeSansTitle?: boolean;
  portfolioImages?: string[];
  section: string;
  title: string;
  year: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasIntroCopy = Boolean(keywordList || description);
  const hasIntroPanel = Boolean(title.trim() || keywordList || description);

  useEffect(() => {
    const row = scrollRef.current;
    if (!row) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      row.scrollLeft += event.deltaY * 0.9;
    };

    row.addEventListener("wheel", onWheel, { passive: false });
    return () => row.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div aria-label="Project presentation" className="master-strip" ref={scrollRef}>
      <div className="master-strip__track">
        {hasIntroPanel ? (
          <article
            className={`master-strip__panel master-strip__panel--intro${
              hasIntroCopy ? "" : " master-strip__panel--intro-title-only"
            }${largeSansTitle ? " master-strip__panel--intro-sans" : ""}`}
          >
            <header className="master-strip__intro-head">
              <p className="master-strip__eyebrow">
                {year ? `${section} · ${year}` : section}
              </p>
              {title.trim() ? (
                <h1
                  className={`master-strip__title${
                    largeSansTitle ? " master-strip__title--sans" : ""
                  }`}
                >
                  {title}
                </h1>
              ) : null}
            </header>

            {keywordList || description ? (
              <div className="master-strip__intro-body">
                {keywordList ? (
                  <p className="master-strip__text">
                    <span className="master-strip__label">Keywords:</span> {keywordList}
                  </p>
                ) : null}
                {description ? (
                  <>
                    <p className="master-strip__label master-strip__label--section">Introduction</p>
                    <p className="master-strip__text master-strip__text--body">{description}</p>
                  </>
                ) : null}
              </div>
            ) : null}
          </article>
        ) : null}

        {portfolioImages.map((image, index) => (
          <StripImage
            alt={`${title} — 作品集 ${index + 1}`}
            className="master-strip__panel master-strip__panel--portfolio"
            key={`portfolio-${index + 1}-${image}`}
            src={image}
          />
        ))}

        {heroImages.map((image, index) => (
          <StripImage
            alt={`${title} — 大片 ${index + 1}`}
            className="master-strip__panel master-strip__panel--hero"
            key={`hero-${index + 1}-${image}`}
            src={image}
          />
        ))}
      </div>
    </div>
  );
}
