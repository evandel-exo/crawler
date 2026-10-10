import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Concave corner shapes from the source's "tab" component. `down` tabs hang from a
// top edge (rounded bottom corners); `up` tabs rise from a bottom edge.
const PATHS = {
  down: {
    left: "M97.9793 100H94.2259C89.1383 100 84.8617 96.1802 84.2894 91.1249L81.0292 62.3261C78.3717 38.8522 59.6475 20.4412 36.1321 18.1801L9.04288 15.5754C3.91443 15.0823 0 10.7734 0 5.6213V2.02994C0 0.913742 0.913642 0.0135727 2.02971 0.030159L98.986 1.47059L99.9792 97.9794C99.9907 99.092 99.0919 100 97.9793 100Z",
    right:
      "M2.02069 100H5.77409C10.8617 100 15.1383 96.1802 15.7106 91.1249L18.9708 62.3261C21.6283 38.8522 40.3525 20.4412 63.8679 18.1801L90.9571 15.5754C96.0856 15.0823 100 10.7734 100 5.6213V2.02994C100 0.913742 99.0864 0.0135727 97.9703 0.030159L1.01401 1.47059L0.0207977 97.9794C0.00934601 99.092 0.908073 100 2.02069 100Z",
  },
  up: {
    left: "M97.9793 0H94.2259C89.1383 0 84.8617 3.81982 84.2894 8.87512L81.0292 37.6739C78.3717 61.1478 59.6475 79.5588 36.1321 81.8199L9.04288 84.4246C3.91443 84.9177 0 89.2266 0 94.3787V97.9701C0 99.0863 0.913642 99.9864 2.02971 99.9698L98.986 98.5294L99.9792 2.02058C99.9907 0.908025 99.0919 0 97.9793 0Z",
    right:
      "M2.02069 0H5.77409C10.8617 0 15.1383 3.81982 15.7106 8.87512L18.9708 37.6739C21.6283 61.1478 40.3525 79.5588 63.8679 81.8199L90.9571 84.4246C96.0856 84.9177 100 89.2266 100 94.3787V97.9701C100 99.0863 99.0864 99.9864 97.9703 99.9698L1.01401 98.5294L0.0207977 2.02058C0.00934601 0.908025 0.908073 0 2.02069 0Z",
  },
} as const;

type NotchProps = {
  direction: "up" | "down";
  size?: number;
  className?: string;
  children: ReactNode;
};

export function Notch({ direction, size = 26, className, children }: NotchProps) {
  const radius = (size * 2) / 3;
  const offset = size * 0.15873015873;
  const edge = direction === "down" ? { top: -offset } : { bottom: -offset };
  const corners =
    direction === "down"
      ? { borderBottomLeftRadius: radius, borderBottomRightRadius: radius }
      : { borderTopLeftRadius: radius, borderTopRightRadius: radius };

  return (
    <div
      className={cn("relative mx-6 flex px-3 py-2", className)}
      style={{ background: "var(--rr-notch)", ...corners }}
    >
      <div className="absolute flex" style={{ ...edge, right: `calc(100% - ${offset}px)` }}>
        <svg width={size} height={size} viewBox="0 0 100 100" fill="var(--rr-notch)" aria-hidden="true">
          <path d={PATHS[direction].left} />
        </svg>
      </div>
      <div className="flex-1">{children}</div>
      <div className="absolute flex" style={{ ...edge, left: `calc(100% - ${offset}px)` }}>
        <svg width={size} height={size} viewBox="0 0 100 100" fill="var(--rr-notch)" aria-hidden="true">
          <path d={PATHS[direction].right} />
        </svg>
      </div>
    </div>
  );
}
