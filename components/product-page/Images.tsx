"use client";

import "./styles.css";

import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

export default function EmblaCarousel({ images }: { images: string[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000 })]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {images.map(image => (
          <div className="embla__slide" key={image}>
            <Image src={process.env.AWS + image} alt="product image" width={500} height={500} />
          </div>
        ))}
      </div>
    </div>
  );
}
