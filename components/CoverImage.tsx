"use client";

import { useState } from "react";

type CoverImageProps = {
  src?: string;
  alt: string;
  className?: string;
  fallback: React.ReactNode;
};

// Shows a photo if one is set and loads successfully; otherwise (no URL, or
// a broken link) shows the caller's fallback instead of a blank/broken
// image. Used by both recipe cards and occasion collection covers so photo
// handling stays consistent everywhere.
//
// Plain <img>, not next/image: recipe photos can come from any domain the
// person pastes a link from, and next/image needs each remote domain
// allow-listed ahead of time — not workable for arbitrary user URLs.
export default function CoverImage({ src, alt, className, fallback }: CoverImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <>{fallback}</>;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
  );
}
