"use client";

import { useState } from "react";

export function PublicationThumb({
  src,
  alt,
  year
}: {
  src: string;
  alt: string;
  year: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#efefef] text-[10px] font-medium uppercase tracking-wide text-[#b5b5b5]">
        {year}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
      src={src}
    />
  );
}
