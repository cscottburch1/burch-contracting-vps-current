'use client';

import Image from 'next/image';
import { useState } from 'react';

const FALLBACK = '/images/projects/placeholder.webp';

export function ProjectCardImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={failed ? FALLBACK : src}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      width={600}
      height={336}
      onError={() => setFailed(true)}
    />
  );
}
