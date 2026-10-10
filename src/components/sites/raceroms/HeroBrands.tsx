"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { vehicleTypes } from "./data";

/* eslint-disable @next/next/no-img-element */

export function HeroBrands() {
  const brandsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(vehicleTypes[0].slug);
  const current = vehicleTypes.find((t) => t.slug === active) ?? vehicleTypes[0];

  return (
    <>
      <div className="rr-container">
        <div className="relative flex h-[480px] overflow-hidden rounded-[24px] md:rounded-[42px] lg:h-[680px]">
          <img
            src="/sites/raceroms/images/car-bg.jpg"
            className="absolute left-0 right-2 top-0 h-full w-full object-cover"
            alt=""
          />
          <div className="absolute left-0 top-0 h-full w-full bg-linear-to-b from-overlay to-overlay-end/75" />
          <div className="relative flex flex-1 flex-col items-center justify-center px-4">
            <img src="/sites/raceroms/images/logo.png" alt="Raceroms" className="w-[120px] lg:w-[154px]" />
            <h1 className="flex flex-col text-center text-base leading-6 font-black lg:pt-4 lg:text-4xl lg:leading-10">
              Chip Tuning &amp; ECU Remapping - Για εσένα που παίρνεις στα σοβαρά το όχημα σου !
            </h1>
            <p className="flex flex-col pt-4 text-center text-sm leading-5 lg:text-2xl lg:leading-8">
              Με γνώμονα την σωστή λειτουργία του οχήματος σου προσφέρουμε ΕΞΑΤΟΜΙΚΕΥΜΕΝΕΣ ΛΥΣΕΙΣ προγραμματισμού
              πάντα με εγγύηση καλής λειτουργίας !
            </p>
            <button
              type="button"
              onClick={() => brandsRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="relative mt-4 flex h-auto flex-col items-center justify-center gap-2 whitespace-normal rounded-[6px] bg-primary px-8 py-2 text-sm leading-5 font-normal uppercase text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:mt-10 lg:text-lg lg:leading-7"
            >
              ΕΠΕΛΕΞΕ
            </button>
            <p className="mt-2 text-xs leading-4 uppercase lg:text-base lg:leading-6">ΤΟ ΟΧΗΜΑ ΣΟΥ ΚΑΙ ΔΕΣ ΤΗ ΔΥΝΑΜΙΚΗ ΤΟΥ</p>
          </div>
        </div>
      </div>

      <div ref={brandsRef} className="rr-container relative">
        <img
          className="absolute left-0 top-[20px] -z-10 hidden h-[900px] w-full object-cover lg:block"
          src="/sites/raceroms/images/brands-mask.png"
          alt=""
        />
        <div className="relative">
          <div className="flex justify-center">
            <div
              role="tablist"
              className="flex w-full max-w-[94%] flex-wrap justify-center gap-x-4 rounded-b-[24px] bg-primary/30 p-2 text-sm leading-5 font-light backdrop-blur-[24px] md:text-xl md:leading-7 lg:gap-8 lg:p-10"
            >
              {vehicleTypes.map((type) => {
                const selected = type.slug === active;
                return (
                  <button
                    key={type.slug}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(type.slug)}
                    className={cn(
                      "relative inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] p-0 text-sm leading-5 underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:text-3xl lg:leading-9",
                      selected ? "font-bold text-foreground" : "font-normal text-secondary-muted",
                    )}
                  >
                    <p>{type.title}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="justify-center lg:mx-[48px]">
            <div className="rounded-b-[24px] bg-black/20 px-8 pb-8 pt-6 backdrop-blur-[20px] lg:px-16 lg:pt-16">
              <div role="tabpanel" className="grid grid-cols-3 gap-6 lg:grid-cols-6">
                {current.brands.map((brand) => (
                  <a
                    key={brand.href}
                    href={brand.href}
                    className="relative flex min-w-[10px] flex-col items-center gap-2 lg:gap-6"
                  >
                    <img src={brand.logo} className="h-[65px] w-[65px] object-contain" alt={brand.title} />
                    {brand.isNew && (
                      <span className="absolute left-[15%] top-0 -rotate-[30deg] rounded-[16px] bg-[#89F336] px-2 text-xs leading-4 text-secondary-background">
                        Νέο
                      </span>
                    )}
                    <span className="truncate text-center text-sm leading-5 lg:text-base lg:leading-6">{brand.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
