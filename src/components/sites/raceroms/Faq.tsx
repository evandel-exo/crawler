"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./HomeCarousel";
import { faqs } from "./data";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  // Keep the panel mounted while the close animation runs.
  const [present, setPresent] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (el) el.style.setProperty("--rr-content-height", `${el.scrollHeight}px`);
  }, [present, open]);

  const toggle = () => {
    if (!open) setPresent(true);
    setOpen((v) => !v);
  };

  return (
    <div data-state={open ? "open" : "closed"} className="rounded-[16px] bg-secondary-background px-8 py-2">
      <h2 className="flex">
        <button
          type="button"
          id={`${id}-trigger`}
          aria-controls={`${id}-panel`}
          aria-expanded={open}
          data-state={open ? "open" : "closed"}
          onClick={toggle}
          className="flex flex-1 items-center justify-between py-4 text-start text-base font-medium transition-all hover:underline data-[state=open]:font-bold md:text-lg"
        >
          {question}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={cn("h-4 w-4 shrink-0 transition-transform duration-200", open && "rotate-180")}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h2>
      <div
        ref={panelRef}
        role="region"
        id={`${id}-panel`}
        aria-labelledby={`${id}-trigger`}
        data-state={open ? "open" : "closed"}
        hidden={!present}
        onAnimationEnd={() => !open && setPresent(false)}
        className="rr-accordion overflow-hidden text-sm transition-all"
      >
        <div className="pb-4 pt-0 text-xs font-light text-foreground/70 md:text-base">
          <div className="rr-rich" dangerouslySetInnerHTML={{ __html: answer }} />
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  return (
    <div className="secondary-container rr-container pt-10 lg:pt-32">
      <div className="flex flex-wrap justify-between gap-4 pb-4 pl-4 lg:pl-0">
        <SectionHeading big="Συχνές Ερωτήσεις" />
      </div>
      <div className="secondary-container w-full space-y-4 lg:mt-16">
        {faqs.map((faq) => (
          <FaqItem key={faq.question} {...faq} />
        ))}
      </div>
    </div>
  );
}
