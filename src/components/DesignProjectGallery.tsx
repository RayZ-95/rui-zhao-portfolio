"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { encodePublicAssetPath } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_SLOTS = 3;

export function DesignProjectGallery({
  images,
  title
}: {
  images: string[];
  title: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const slots = Array.from({ length: GALLERY_SLOTS }, (_, index) => images[index] ?? "");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-gallery-item]", root);

    const ctx = gsap.context(() => {
      items.forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            toggleActions: "play none none reverse"
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        });
      });
    }, root);

    return () => ctx.revert();
  }, [images.length]);

  return (
    <div className="design-project-gallery" ref={rootRef}>
      {slots.map((image, index) => (
        <figure
          className={`design-project-gallery__item${image ? "" : " design-project-gallery__item--empty"}`}
          data-gallery-item
          data-slot={index + 1}
          key={`gallery-slot-${index}`}
        >
          {image ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`${title} — image ${index + 1}`}
                className="design-project-gallery__image"
                draggable={false}
                src={encodePublicAssetPath(image)}
              />
            </>
          ) : (
            <span className="design-project-gallery__placeholder" aria-hidden="true" />
          )}
        </figure>
      ))}
    </div>
  );
}
