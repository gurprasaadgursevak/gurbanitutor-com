"use client";

import { useEffect } from "react";

/**
 * Registers the service worker on first mount in production.
 * Dev mode is skipped to avoid stale caches while iterating.
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (err) {
        console.warn("Service Worker registration failed:", err);
      }
    };

    // Defer until after first paint so we don't slow the initial load.
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
