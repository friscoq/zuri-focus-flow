import confetti from "canvas-confetti";

function reducedMotion(): boolean {
  try {
    if (document.documentElement.classList.contains("reduce-motion")) return true;
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function celebrate(opts?: { particles?: number }) {
  if (reducedMotion()) return;
  try {
    confetti({
      particleCount: Math.max(12, Math.min(100, opts?.particles ?? 24)),
      spread: 45,
      startVelocity: 25,
      ticks: 120,
      origin: { y: 0.8 },
      scalar: 0.8,
      zIndex: 9999,
    });
  } catch {}
}
