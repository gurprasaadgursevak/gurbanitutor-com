"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Platform = "android-chrome" | "ios-safari" | "other";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios-safari";
  if (/Android/.test(ua)) return "android-chrome";
  return "other";
}

/**
 * Renders a "Install web app" button that adapts to the current browser:
 * - Chrome / Edge / Android Chrome: triggers the native install prompt.
 * - iOS Safari: opens a small instructions sheet ("Share → Add to Home Screen").
 * - Other desktop browsers: opens generic instructions.
 * Hides itself completely if the user is already running inside the PWA.
 */
export default function InstallWebAppButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState<Platform>("other");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPlatform(detectPlatform());

    // Detect if already installed (running standalone).
    const matchStandalone = window.matchMedia?.("(display-mode: standalone)").matches ?? false;
    const iosStandalone =
      // Safari sets navigator.standalone on iOS when launched from Home Screen.
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(matchStandalone || iosStandalone);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (isStandalone || installed) return null;

  const handleClick = async () => {
    if (deferred) {
      try {
        await deferred.prompt();
        await deferred.userChoice;
      } catch {
        // user dismissed
      }
      setDeferred(null);
      return;
    }
    setShowSheet(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-amber-50 px-6 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
      >
        Install web app
      </button>

      {showSheet && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setShowSheet(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-900">Install Gurbani Tutor</h3>
              <button
                onClick={() => setShowSheet(false)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-700">
              Works on any device. After install, the app opens like a real app and works
              offline.
            </p>

            {platform === "ios-safari" && (
              <ol className="mt-5 space-y-3 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-700">1.</span>
                  <span>Open this page in Safari (not in another app's browser).</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-700">2.</span>
                  <span>
                    Tap the <strong>Share</strong> icon at the bottom (the square with an
                    arrow).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-700">3.</span>
                  <span>
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-700">4.</span>
                  <span>
                    Tap <strong>Add</strong>. The icon appears on your home screen.
                  </span>
                </li>
              </ol>
            )}

            {platform === "android-chrome" && (
              <ol className="mt-5 space-y-3 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-700">1.</span>
                  <span>
                    Open this page in Chrome. Tap the three-dot menu at the top right.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-700">2.</span>
                  <span>
                    Tap <strong>Install app</strong> (or <strong>Add to Home Screen</strong>).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-700">3.</span>
                  <span>
                    Confirm. The Gurbani Tutor icon appears on your home screen.
                  </span>
                </li>
              </ol>
            )}

            {platform === "other" && (
              <ol className="mt-5 space-y-3 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-700">1.</span>
                  <span>
                    Use Chrome, Edge, or Brave. Other browsers (Firefox, Safari on Mac) may not
                    support installable web apps yet.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-700">2.</span>
                  <span>
                    Look for a small install icon in the address bar (looks like a screen with a
                    down arrow). Click it.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-amber-700">3.</span>
                  <span>
                    If you don't see it, open the browser menu and look for{" "}
                    <strong>Install Gurbani Tutor</strong>.
                  </span>
                </li>
              </ol>
            )}

            <p className="mt-5 text-xs text-slate-500">
              Tip: you can also keep using the website directly in your browser without
              installing. Installing just adds a home-screen icon and offline support.
            </p>

            <button
              onClick={() => setShowSheet(false)}
              className="mt-5 w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
