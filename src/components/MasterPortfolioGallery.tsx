"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { encodePublicAssetPath } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export function MasterPortfolioGallery({
  heroImages,
  title
}: {
  heroImages: string[];
  title: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-master-gallery-item]", root);

    const ctx = gsap.context(() => {
      items.forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            toggleActions: "play none none reverse"
          },
          y: 36,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      });
    }, root);

    return () => ctx.revert();
  }, [heroImages.length]);

  if (heroImages.length === 0) return null;

  return (
    <div className="master-portfolio-gallery" ref={rootRef}>
      <div className="master-portfolio-gallery__heroes">
        {heroImages.map((image, index) => (
          <figure className="master-portfolio-gallery__hero-item" data-master-gallery-item key={`${image}-${index}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${title} — work ${index + 1}`}
              className="master-portfolio-gallery__image"
              draggable={false}
              src={encodePublicAssetPath(image)}
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
