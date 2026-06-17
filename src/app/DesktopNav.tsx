"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavItem = { href: string; label: string };
type NavTab =
  | { kind: "link"; label: string; href: string }
  | { kind: "group"; label: string; items: NavItem[] };

const TABS: NavTab[] = [
  {
    kind: "group",
    label: "Read",
    items: [
      { href: "/granth", label: "Read Gurbani" },
      { href: "/mukhvak", label: "Sri Mukhvak" },
      { href: "/gareebi-pothi", label: "Gareebi Pothi" },
      { href: "/pothi", label: "Pothi Sahib library" },
    ],
  },
  {
    kind: "group",
    label: "Learn",
    items: [
      { href: "/arths", label: "Arths · Vocab" },
      { href: "/quiz", label: "Gurbani Quiz" },
      { href: "/shabad-test", label: "Shabad Test" },
    ],
  },
  { kind: "link", label: "Search", href: "/search" },
  { kind: "link", label: "About", href: "/about" },
];

function pathMatchesItem(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function tabIsActive(pathname: string, tab: NavTab): boolean {
  if (tab.kind === "link") return pathMatchesItem(pathname, tab.href);
  return tab.items.some((i) => pathMatchesItem(pathname, i.href));
}

export default function DesktopNav() {
  const pathname = usePathname() || "/";
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!openLabel) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpenLabel(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenLabel(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openLabel]);

  return (
    <div
      ref={rootRef}
      className="hidden items-end gap-1 sm:flex"
      role="navigation"
      aria-label="Primary"
    >
      {TABS.map((tab) => {
        const active = tabIsActive(pathname, tab);
        const base =
          "relative inline-flex h-9 items-center rounded-t-lg border-b-0 px-4 text-sm font-medium transition -mb-px";
        const activeCls =
          "bg-white border border-amber-200 text-amber-700 z-10";
        const inactiveCls =
          "border border-transparent text-slate-700 hover:bg-amber-50 hover:text-amber-700";

        if (tab.kind === "link") {
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`${base} ${active ? activeCls : inactiveCls}`}
            >
              {tab.label}
            </Link>
          );
        }

        const isOpen = openLabel === tab.label;
        return (
          <div key={tab.label} className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenLabel((cur) => (cur === tab.label ? null : tab.label))
              }
              aria-haspopup="true"
              aria-expanded={isOpen}
              className={`${base} ${active || isOpen ? activeCls : inactiveCls}`}
            >
              {tab.label}
              <svg
                viewBox="0 0 12 12"
                width="10"
                height="10"
                aria-hidden
                className={`ml-1 transition ${isOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M2 4l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full z-30 mt-1 min-w-[14rem] rounded-xl border border-amber-200 bg-white py-2 shadow-lg"
              >
                {tab.items.map((item) => {
                  const itemActive = pathMatchesItem(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setOpenLabel(null)}
                      className={`flex items-center px-4 py-2 text-sm transition ${
                        itemActive
                          ? "bg-amber-50 font-semibold text-amber-800"
                          : "text-slate-800 hover:bg-amber-50 hover:text-amber-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <span className="mx-2 mb-3 h-5 w-px bg-slate-200" aria-hidden />

      <Link
        href="/santhiya"
        className="mb-3 inline-flex h-8 items-center rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        Santhiya Classes
      </Link>
      <Link
        href="/muharni"
        className="mb-3 inline-flex h-8 items-center rounded-full bg-red-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
      >
        Santhiya 101
      </Link>
    </div>
  );
}
