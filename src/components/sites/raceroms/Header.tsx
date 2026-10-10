"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Notch } from "./Notch";
import { languages, navItems, phoneMenu, socials, type NavLink } from "./site";

const chevron = (className: string) => (
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
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const navTrigger =
  "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 transition-colors focus:bg-accent focus:text-accent-foreground focus:outline-none data-[state=open]:bg-accent/50 bg-transparent text-base! hover:bg-secondary-muted/10 focus-visible:bg-secondary-muted/10";

/** Click-to-open menu used by the "Τηλέφωνα" and language triggers. */
function TopMenu({ trigger, children }: { trigger: ReactNode; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        data-state={open ? "open" : "closed"}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm outline-none"
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-50 mt-1 min-w-32 -translate-x-1/2 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

const menuItem =
  "relative flex min-w-32 cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent";

function DesktopDropdown({ label, items }: { label: string; items: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <li className="relative" onPointerEnter={show} onPointerLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        data-state={open ? "open" : "closed"}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className={cn(navTrigger, "font-light!")}
      >
        {label}
        {chevron("relative top-px ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180")}
      </button>
      {open && (
        <div className="absolute left-0 top-full w-[113px] bg-popover text-popover-foreground animate-in fade-in-0">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block px-4 py-2 text-sm leading-5 transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

const sheetButton =
  "relative inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-base font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 animate-in fade-in-0" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rr-menu-title"
        className="fixed bottom-0 right-0 top-0 z-50 flex w-[320px] flex-col rounded-t-[10px] border border-border bg-background animate-in slide-in-from-right"
      >
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        <h2 id="rr-menu-title" className="mb-2 mt-8 text-center text-lg font-semibold leading-none tracking-tight">
          Raceroms
        </h2>
        <div className="flex flex-col gap-1 p-4 text-center">
          {navItems.map((item) =>
            "children" in item ? (
              <Fragment key={item.label}>
                <button
                  type="button"
                  aria-expanded={expanded === item.label}
                  onClick={() => setExpanded((v) => (v === item.label ? null : item.label))}
                  className={cn(sheetButton, expanded === item.label && "bg-accent")}
                >
                  {item.label}{" "}
                  {chevron(
                    cn("h-4 w-4 transition-transform duration-200", expanded === item.label && "rotate-180"),
                  )}
                </button>
                {expanded === item.label && (
                  <div className="flex flex-col">
                    {item.children.map((child) => (
                      <a key={child.href} href={child.href} className={cn(sheetButton, "text-sm font-light")}>
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </Fragment>
            ) : (
              <a
                key={item.label}
                href={item.href}
                aria-current={item.href === "/" ? "page" : undefined}
                className={cn(sheetButton, item.href === "/" && "router-link-active")}
                onClick={item.href === "/" ? onClose : undefined}
              >
                {item.label}
              </a>
            ),
          )}
          <div className="mt-2 flex justify-center border-t border-border pt-2">
            {languages.map((lang) => (
              <a key={lang.code} href={lang.href} className={cn(sheetButton, "justify-start")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lang.flag} className="mr-2 w-4" alt={lang.code} />
                {lang.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="rr-container relative z-40 mt-[12px]">
        <div className="absolute right-[50%] top-0 z-10 translate-x-[50%] lg:right-32 lg:translate-x-0">
          <Notch direction="down" className="px-6">
            <div className="flex gap-8">
              <div className="hidden lg:block">
                <TopMenu
                  trigger={
                    <>
                      <span className="rr-i-heroicons-phone" aria-hidden="true" />
                      Τηλέφωνα
                      <span className="rr-i-heroicons-chevron-down-solid" aria-hidden="true" />
                    </>
                  }
                >
                  {() =>
                    phoneMenu.map((p) => (
                      <a key={p.phone} href={`tel:${p.phone}`} role="menuitem" className={menuItem}>
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">{p.city}</span>
                          <span className="font-medium">{p.phone}</span>
                        </div>
                      </a>
                    ))
                  }
                </TopMenu>
              </div>
              <div className="hidden lg:block">
                <TopMenu
                  trigger={
                    <span className="flex items-center gap-2 uppercase">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/sites/raceroms/images/gr.svg" className="w-4" alt="gr" /> gr
                      <span className="rr-i-heroicons-chevron-down-solid" aria-hidden="true" />
                    </span>
                  }
                >
                  {(close) =>
                    languages.map((lang) => (
                      <a
                        key={lang.code}
                        href={lang.href}
                        role="menuitem"
                        onClick={lang.code === "gr" ? close : undefined}
                        className={cn(menuItem, "cursor-default")}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={lang.flag} className="w-4" alt="" /> {lang.label}
                      </a>
                    ))
                  }
                </TopMenu>
              </div>
              <div className="lg:hidden">
                <div className="flex gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.icon}
                      href={s.href}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="relative inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md p-0 text-base font-normal transition-colors hover:bg-transparent hover:text-primary"
                    >
                      <span className="sr-only">{s.label}</span>
                      <span className={s.icon} aria-hidden="true" style={{ fontSize: 18 }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Notch>
        </div>
        <div className="absolute left-[0.8rem] right-[0.8rem] flex min-[1025px]:min-h-[100px] items-end px-0 pt-4 lg:px-12">
          <div className="flex w-full items-center px-8">
            <div className="flex gap-4 py-4">
              <nav className="relative z-10 hidden w-full flex-1 items-center justify-center lg:flex lg:w-auto">
                <ul className="group flex w-full flex-1 list-none items-center justify-between gap-x-1">
                  {navItems.map((item) =>
                    "children" in item ? (
                      <DesktopDropdown key={item.label} label={item.label} items={item.children} />
                    ) : (
                      <li key={item.label} className="relative">
                        <a
                          href={item.href}
                          aria-current={item.href === "/" ? "page" : undefined}
                          className={cn(navTrigger, item.href === "/" ? "router-link-active" : "font-light!")}
                        >
                          {item.label}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            </div>
            <div className="ms-auto flex lg:hidden">
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
              >
                Μενού
              </button>
            </div>
          </div>
        </div>
      </div>
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
