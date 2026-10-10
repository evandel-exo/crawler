"use client";

import type { CSSProperties, ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from "embla-carousel";
import { cn } from "@/lib/utils";

export function useHomeCarousel(options?: EmblaOptionsType, plugins?: EmblaPluginType[]) {
  return useEmblaCarousel(options, plugins);
}

export function CarouselArrows({ api, className }: { api: EmblaCarouselType | undefined; className?: string }) {
  const button =
    "relative inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] px-4 py-2 text-base font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <div className={cn("flex items-end gap-2 lg:items-center", className)}>
      <button type="button" aria-label="Προηγούμενο" className={button} onClick={() => api?.scrollPrev()}>
        <span className="rr-i-the-icon-arrow-left-long w-[35px] lg:w-[70px]" aria-hidden="true" style={{ fontSize: 40 }} />
      </button>
      <button type="button" aria-label="Επόμενο" className={button} onClick={() => api?.scrollNext()}>
        <span className="rr-i-the-icon-arrow-right-long w-[35px] lg:w-[70px]" aria-hidden="true" style={{ fontSize: 40 }} />
      </button>
    </div>
  );
}

type CarouselProps = {
  viewportRef: ReturnType<typeof useEmblaCarousel>[0];
  className?: string;
  trackClassName?: string;
  trackStyle?: CSSProperties;
  children: ReactNode;
};

export function Carousel({ viewportRef, className, trackClassName, trackStyle, children }: CarouselProps) {
  return (
    <div className={cn("relative", className)} role="region" aria-roledescription="carousel">
      <div ref={viewportRef} className="overflow-hidden">
        <div className={cn("flex", trackClassName)} style={trackStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function SectionHeading({ small, big, className }: { small?: string; big: string; className?: string }) {
  return (
    <h3 className={cn("flex flex-col break-all font-tertiary", className)}>
      <span className="pb-1 text-[22px] font-light capitalize text-foreground/20 lg:text-5xl">{small}</span>
      <span className="text-4xl font-extrabold uppercase italic lg:text-7xl" style={{ wordBreak: "break-word" }}>
        {big}
      </span>
    </h3>
  );
}
