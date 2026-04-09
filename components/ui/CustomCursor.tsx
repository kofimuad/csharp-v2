"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [onDark, setOnDark] = useState(true);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Start slightly off-screen
    let mouseX = -100,
      mouseY = -100;
    let ringX = -100,
      ringY = -100;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update dot immediately
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      dot.style.opacity = "1";
      ring.style.opacity = "1";

      const el = document.elementFromPoint(
        e.clientX,
        e.clientY,
      ) as HTMLElement | null;
      if (el) {
        let node: HTMLElement | null = el;
        let isDarkSection = theme === "dark";
        for (let i = 0; i < 8 && node; i++) {
          const bg = getComputedStyle(node).backgroundColor;
          if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
            const m = bg.match(/\d+/g);
            if (m) {
              const [r, g, b] = m.map(Number);
              const lum = 0.299 * r + 0.587 * g + 0.114 * b;
              isDarkSection = lum < 140;
            }
            break;
          }
          node = node.parentElement;
        }
        setOnDark(isDarkSection);
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.15);
      ringY = lerp(ringY, mouseY, 0.15);
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      raf = requestAnimationFrame(animate);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (
        t.closest(
          'a, button, [role="button"], .hm-card, .portfolio-item, .service-item, .accordion-header, .filter-btn, .proj-nav-btn, .t-btn, .admin-btn-save, .admin-btn-ghost, .admin-btn-danger, .admin-nav-item, .media-upload-zone',
        )
      ) {
        ring.classList.add("hovering");
      }
    };
    const onOut = (e: MouseEvent) => {
      const t = e.relatedTarget as HTMLElement | null;
      if (!t?.closest('a, button, [role="button"]'))
        ring.classList.remove("hovering");
    };
    const onDown = () => ring.classList.add("clicking");
    const onUp = () => ring.classList.remove("clicking");

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("mousedown", onDown, { passive: true });
    document.addEventListener("mouseup", onUp, { passive: true });

    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
    };
  }, [theme]);

  const isLight = !onDark;
  const ringColor = isLight ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)";
  const dotColor = isLight ? "#111" : "#fff";

  return (
    <>
      <div
        ref={ringRef}
        id="custom-cursor"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 26,
          height: 26,
          borderRadius: "50%",
          border: `1.5px solid ${ringColor}`,
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          transition:
            "width 0.22s ease, height 0.22s, background 0.22s, border-color 0.3s, opacity 0.3s",
          opacity: 0, // Starts invisible
        }}
      />
      <div
        ref={dotRef}
        id="custom-cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: dotColor,
          pointerEvents: "none",
          zIndex: 100000,
          transform: "translate(-50%, -50%)",
          transition: "background 0.3s, opacity 0.15s",
          opacity: 0, // Starts invisible
        }}
      />
      {/* The suppressHydrationWarning is a magic attribute that tells Next.js 
        "don't worry about the quotes here." It's the cleanest fix for this specific bug.
      */}
      <style suppressHydrationWarning>{`
        body { cursor: none !important; }
        a, button, [role="button"], label, select,
        .hm-card, .filter-btn, .accordion-header,
        .service-item, .t-btn, .admin-nav-item,
        .media-upload-zone, .media-preview-remove { cursor: none !important; }
        
        #custom-cursor.hovering {
          width: 52px !important; height: 52px !important;
          background: ${isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.07)"} !important;
          border-color: ${isLight ? "rgba(42,92,255,0.8)" : "rgba(255,255,255,0.9)"} !important;
        }
        #custom-cursor.clicking {
          width: 14px !important; height: 14px !important;
          background: ${isLight ? "rgba(42,92,255,0.15)" : "rgba(255,255,255,0.25)"} !important;
        }
        @media (pointer: coarse) {
          body { cursor: auto !important; }
          #custom-cursor, #custom-cursor-dot { display: none !important; }
        }
      `}</style>
    </>
  );
}
