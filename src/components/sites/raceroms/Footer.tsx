"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Notch } from "./Notch";
import { SOURCE, socials } from "./site";
import { stores, type Store } from "./data";

/* eslint-disable @next/next/no-img-element */

const legalLinks = [
  { label: "Πολιτική Απορρήτου", href: `${SOURCE}/privacy_policy` },
  { label: "Εγγύηση και Υπευθυνότητα", href: `${SOURCE}/warranty_liability` },
];

const linkButton =
  "relative items-center justify-center gap-2 whitespace-nowrap rounded-[6px] h-9 text-base font-normal text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const inlineLink =
  "relative inline-flex h-auto items-center justify-center gap-2 whitespace-nowrap rounded-[6px] p-0 text-sm font-normal underline-offset-4 transition-colors hover:underline";

/** CMS opening hours come as one <p> with <br> separators. */
function OpenTimes({ html }: { html: string }) {
  return <div className="text-foreground/50" dangerouslySetInnerHTML={{ __html: html.replace(/&nbsp;/g, " ") }} />;
}

function Icon({ name, className }: { name: string; className?: string }) {
  return <span className={cn(name, className)} aria-hidden="true" style={{ fontSize: 20 }} />;
}

function StoreDetails({ store, mobile }: { store: Store; mobile: boolean }) {
  return (
    <>
      <div className={cn("flex items-center gap-2", mobile && "pt-4")}>
        <Icon name="rr-i-heroicons-map-pin" className="text-foreground" />
        <p className={cn("text-foreground/50 underline", !mobile && "flex-1")}>
          <a href={store.location}>{mobile ? `${store.title} - Προβολή στο χάρτη` : store.title}</a>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Icon name="rr-i-heroicons-clock" className="text-foreground" />
        <OpenTimes html={store.openTimes} />
      </div>
      <div className="flex items-center gap-2">
        <Icon name="rr-i-heroicons-envelope" className="text-foreground" />
        <a
          href={`mailto:${store.email}`}
          rel="noopener noreferrer"
          className={cn(inlineLink, "text-foreground/50", mobile && "underline")}
        >
          {store.email}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Icon name="rr-i-heroicons-phone" />
        <div className="flex-1">
          {store.phones.map((phone) => (
            <div key={phone}>
              <a href={`tel:${phone}`} rel="noopener noreferrer" className={cn(inlineLink, "text-primary")}>
                {phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function StoreCard({ store }: { store: Store }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-[12px] bg-tertiary-background">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-4 lg:hidden"
      >
        <div className="flex items-center gap-2 text-yellow-600">
          <Icon name="rr-i-heroicons-map" className="text-foreground/50" />
          <p>{store.title}</p>
        </div>
        <Icon
          name="rr-i-heroicons-chevron-down"
          className={cn("text-foreground transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="grid grid-cols-1 gap-2 border-t border-foreground/10 px-4 pb-4 text-sm lg:hidden">
          <StoreDetails store={store} mobile />
        </div>
      )}
      <div className="hidden grid-cols-4 gap-8 px-4 py-4 text-base lg:grid">
        <StoreDetails store={store} mobile={false} />
      </div>
    </div>
  );
}

function Copyright({ className }: { className?: string }) {
  return (
    <p className={cn("text-foreground/50", className)}>
      © <span>2026</span> <span className="font-bold text-primary">Raceroms</span>. Με την επιφύλαξη παντός δικαιώματος.
    </p>
  );
}

export function Footer() {
  return (
    <>
      <div className="rr-container relative max-lg:hidden">
        <div className="absolute -top-[200px] right-0 -z-10 h-[578px] w-[578px] rounded-full bg-primary opacity-15 blur-[150px]" />
      </div>
      <footer className="rr-container relative mt-20">
        <div className="rounded-[24px] bg-secondary-background p-4 pb-0 lg:p-14 lg:pb-0">
          <div className="grid grid-cols-1 gap-10 pb-10 lg:grid-cols-4">
            <div className="order-1 flex w-full flex-col items-center gap-6 lg:order-none lg:items-start">
              <img src="/sites/raceroms/images/logo.png" alt="Raceroms" className="w-[154px]" />
              <div className="flex flex-col gap-2">
                {legalLinks.map((link) => (
                  <a key={link.href} href={link.href} className={cn(linkButton, "hidden p-0 lg:inline-block")}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="order-2 row-span-2 space-y-6 text-center lg:order-none lg:col-span-3 lg:col-start-2 lg:row-start-1">
              <h3 className="text-lg font-semibold md:text-2xl">ΔΙΕΥΘΥΝΣΕΙΣ ΚΑΤΑΣΤΗΜΑΤΩΝ</h3>
              <div className="grid grid-cols-1 gap-4">
                {stores.map((store) => (
                  <StoreCard key={store.title} store={store} />
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {legalLinks.map((link) => (
                  <a key={link.href} href={link.href} className={cn(linkButton, "inline-block px-4 py-2 lg:hidden")}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div role="separator" className="relative hidden h-px w-full shrink-0 bg-foreground/10 lg:block" />
          <div className="grid items-center gap-y-10 pt-4 lg:grid-cols-3">
            <Copyright className="hidden pb-4 lg:block" />
            <div className="flex justify-center self-end">
              <Notch direction="up" size={50}>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="flex cursor-pointer flex-col items-center gap-2 justify-self-center px-10 text-center"
                >
                  <span className="rr-i-heroicons-arrow-up" aria-hidden="true" style={{ fontSize: 24 }} />
                  <span>Επιστροφή στην Κορυφή</span>
                </button>
              </Notch>
            </div>
            <div className="row-start-1 hidden justify-center gap-4 lg:row-auto lg:flex lg:justify-end lg:pb-4">
              {socials.map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="relative inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] p-0 text-base font-normal transition-colors hover:bg-transparent hover:text-primary"
                >
                  <span className="sr-only">{s.label}</span>
                  <span className={s.icon} aria-hidden="true" style={{ fontSize: 24 }} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <Copyright className="py-8 text-center lg:hidden" />
      </footer>
      <a href="viber://contact?number=%2B306973766116" rel="nofollow" target="_blank" className="floating-icon">
        <img src="/sites/raceroms/images/viber.png" alt="viber contact icon" />
        <span className="sr-only">Contact us on Viber</span>
      </a>
    </>
  );
}
