"use client";

import "./styles.css";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/UI/carousel";

export default function EmblaCarousel({ images }: { images: string[] }) {
  return (
    <div className="me-4">
      <Carousel>
        <CarouselContent>
          {images.map(image => (
            <CarouselItem key={image}>
              <Image src={process.env.AWS + image} alt="product image" width={500} height={500} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
