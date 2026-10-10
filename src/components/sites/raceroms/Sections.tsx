"use client";

import { useMemo } from "react";
import AutoHeight from "embla-carousel-auto-height";
import { Notch } from "./Notch";
import { Carousel, CarouselArrows, SectionHeading, useHomeCarousel } from "./HomeCarousel";
import { equipment, reviews, specialty } from "./data";

/* eslint-disable @next/next/no-img-element */

export function Specialty() {
  const [ref, api] = useHomeCarousel();
  return (
    <div className="secondary-container rr-container pb-10 pt-10 lg:pt-32!">
      <div className="flex flex-wrap justify-between">
        <SectionHeading small="Τι κάνουμε" big="Ειδικότητα μας" className="pb-7" />
        <CarouselArrows api={api} />
      </div>
      <Carousel viewportRef={ref} className="mt-8 lg:mt-16" trackClassName="-ml-10">
        {specialty.map((text, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            className="min-w-[275px] shrink-0 grow-0 basis-[66%] pl-10 lg:basis-[28%]"
          >
            <div className="select-none list-none rounded-[24px] bg-foreground p-8 text-background">{text}</div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

const trustSlide = "min-w-[275px] shrink-0 grow-0 basis-[66%] space-y-4 pl-4 lg:basis-[45%]";

export function Trust() {
  const [ref, api] = useHomeCarousel();
  return (
    <div className="secondary-container rr-container pt-10 lg:pt-32!">
      <div className="text-center">
        <h3 className="text-2xl font-extrabold uppercase italic lg:text-5xl">ΓΙΑΤΙ ΝΑ ΜΑΣ ΕΜΠΙΣΤΕΥΤΕΙΣ</h3>
      </div>
      <p className="mt-6 text-center text-base lg:text-xl">
        Το όχημά σας είναι μια σοβαρή επένδυση. Η απόφαση για τη βελτίωσή του θα πρέπει να συνοδεύεται από
        τεχνογνωσία, ασφάλεια και αποδεδειγμένα αποτελέσματα. Η δέσμευση μας απέναντι σας είναι η εξής:
      </p>
      <CarouselArrows api={api} className="mt-4 sm:justify-end" />
      <Carousel viewportRef={ref} className="mt-10" trackClassName="-ml-4 space-x-6">
        <div role="group" aria-roledescription="slide" className={trustSlide}>
          <p className="text-lg font-bold">100 % Ασφαλές Tuning</p>
          <div className="space-y-4">
            <p>Εργαζόμαστε με κάθε τύπο και μοντέλο οχήματος, με απόλυτο σεβασμό στη μακροζωία του κινητήρα.</p>
            <p>Η φιλοσοφία μας βασίζεται σε τρία στοιχεία:</p>
          </div>
          <ul className="ml-5 list-disc space-y-2">
            <li>Μέγιστη ισχύ και ροπή με ασφάλεια.</li>
            <li>Μείωση κατανάλωσης καυσίμου χωρίς συμβιβασμούς στην ιπποδύναμη</li>
            <li>Ομαλή λειτουργία και αξιοπιστία σε κάθε διαδρομή.</li>
          </ul>
          <div>
            Με <strong>εξατομικευμένη χαρτογράφηση ECU (custom tuning)</strong>, πετυχαίνουμε την ιδανική ισορροπία
            ανάμεσα σε δύναμη, οικονομία και αξιοπιστία.
          </div>
        </div>
        <div role="group" aria-roledescription="slide" className={trustSlide}>
          <p className="text-lg font-bold">Υψηλής ποιότητας λογισμικό</p>
          <div className="space-y-4">
            <p>Εως και 40-50% βελτίωση</p>
            <p>
              Μέσα από εξελιγμένες τεχνικές προγραμματισμού, προσαρμόζουμε τον εγκέφαλο του αυτοκινήτου σου ακριβώς
              στις ανάγκες σου, ώστε κάθε διαδρομή να είναι απολαυστική, ασφαλής και μοναδική.
            </p>
            <p>Στην Raceroms δεν μιλάμε απλώς για tuning – μιλάμε για μια εξελιγμένη εμπειρία οδήγησης.</p>
          </div>
        </div>
        <div role="group" aria-roledescription="slide" className={trustSlide}>
          <p className="text-lg font-bold">Δοκιμασμένο λογισμικό για εσένα, πριν απο εσένα</p>
          <div className="space-y-4">
            <p>
              Στη Raceroms η ποιότητα και η ασφάλεια δεν αφήνονται ποτέ στην τύχη. Κάθε λογισμικό που αναπτύσσουμε
              δοκιμάζεται εκτενώς στο δυναμόμετρό μας, με πραγματικές μετρήσεις σε διαφορετικά φορτία και σενάρια
              οδήγησης.
            </p>
            <p>Με αυτόν τον τρόπο διασφαλίζουμε ότι ο προγραμματισμός:</p>
            <p />
          </div>
          <ul className="ml-5 list-disc space-y-2">
            <li>προσφέρει μετρήσιμη αύξηση σε ιπποδύναμη και ροπή,</li>
            <li>διατηρεί τη σταθερότητα και τη μακροζωία του κινητήρα,</li>
            <li>έχει ομαλή απόδοση χωρίς κινδύνους,</li>
            <li>είναι 100% δοκιμασμένη πριν φτάσει στα χέρια σας.</li>
          </ul>
          <p>
            Για εμάς, η βελτίωση του αυτοκινήτου σας δεν είναι απλώς υπόσχεση – είναι αποτέλεσμα πραγματικών δοκιμών
            που μπορείτε να εμπιστευτείτε.
          </p>
        </div>
      </Carousel>
      <div className="mt-10 grid grid-cols-3 gap-8 text-sm lg:text-base" />
    </div>
  );
}

export function EquipmentSection() {
  const [ref, api] = useHomeCarousel();
  return (
    <div className="secondary-container rr-container pt-10 lg:pt-32!">
      <div className="flex flex-wrap justify-between gap-4">
        <SectionHeading small="Νέος" big="Εξοπλισμός" />
        <CarouselArrows api={api} />
      </div>
      <Carousel viewportRef={ref} className="mt-8 lg:mt-16" trackClassName="-ml-4">
        {equipment.map((item) => (
          <div
            key={item.href}
            role="group"
            aria-roledescription="slide"
            className="min-w-[275px] shrink-0 grow-0 basis-[66%] pl-4 lg:basis-[28%]"
          >
            <a href={item.href} className="block rounded-[24px] bg-white px-3 pt-5">
              <div className="flex justify-center">
                <img src={item.image} alt={item.title} width={188} className="rounded-[12px]" />
              </div>
              <div className="mx-4 mt-20">
                <Notch direction="up">
                  <div className="text-center">
                    <span className="line-clamp-1 text-xl font-extrabold">{item.title}</span>
                  </div>
                </Notch>
              </div>
            </a>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export function Reviews() {
  const plugins = useMemo(() => [AutoHeight()], []);
  const [ref, api] = useHomeCarousel({ loop: true }, plugins);
  return (
    <div className="secondary-container rr-container pt-10 lg:pt-32!">
      <div className="flex flex-wrap justify-between gap-4 pl-4 lg:pl-0">
        <SectionHeading small="Πελάτες" big="Εμπειρίες πελατών" />
        <CarouselArrows api={api} />
      </div>
      <Carousel
        viewportRef={ref}
        className="mt-16"
        trackClassName="-ml-4 items-start"
        trackStyle={{ transition: "height 0.2s" }}
      >
        {reviews.map((review, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            className="min-w-[275px] shrink-0 grow-0 basis-full pl-4 lg:basis-[66%]"
          >
            <div className="rounded-[24px] bg-white px-3 pt-5">
              <div className="flex p-8 text-sm text-black lg:p-20 lg:text-base">
                <p>{review.text}</p>
              </div>
              <div className="flex justify-center">
                <Notch direction="up" size={32}>
                  <div className="flex items-center gap-4 px-10">
                    <div className="text-base font-semibold lg:text-2xl">{review.author}</div>
                  </div>
                </Notch>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
