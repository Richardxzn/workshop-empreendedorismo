"use client";

import { useEffect, useRef, useState } from "react";
import { EVENT } from "@/lib/event";

// Ilustração usada se a foto do Unsplash não carregar (sem internet, link removido etc.)
function SchoolIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-label="Ilustração de uma escola"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="300" fill="#D6E0F3" />
      <rect y="230" width="400" height="70" fill="#B9C9EA" />
      <rect x="70" y="120" width="260" height="110" fill="#FDFDFB" stroke="#17224D" strokeWidth="4" />
      <polygon points="60,120 200,55 340,120" fill="#2340C8" stroke="#17224D" strokeWidth="4" />
      <rect x="175" y="165" width="50" height="65" fill="#FFE14D" stroke="#17224D" strokeWidth="4" />
      {[95, 130, 250, 285].map((x) => (
        <rect key={x} x={x} y="150" width="24" height="30" fill="#D6E0F3" stroke="#17224D" strokeWidth="3" />
      ))}
      <line x1="200" y1="55" x2="200" y2="20" stroke="#17224D" strokeWidth="4" />
      <polygon points="200,20 232,30 200,40" fill="#E5484D" />
    </svg>
  );
}

export default function HeroImage() {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { src, alt, credit } = EVENT.heroImage;

  // Se a imagem falhou antes da hidratação, o onError não dispara: confere aqui.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <figure>
      <div className="aspect-[4/3] overflow-hidden border-2 border-tinta bg-linha lg:aspect-[4/5]">
        {failed ? (
          <SchoolIllustration />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={1400}
            height={1050}
            fetchPriority="high"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      {!failed && <figcaption className="mt-2 text-sm text-tinta/70">{credit}</figcaption>}
    </figure>
  );
}
