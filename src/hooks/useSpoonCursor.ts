"use client";

import { useEffect, useRef } from "react";

/**
 * useSpoonCursor
 * Drop this into any page component — one line:
 *   useSpoonCursor();
 *
 * Automatically skips on touch devices (pointer:coarse).
 * Cleans up cursor element on unmount.
 */
export function useSpoonCursor() {
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer:coarse)").matches) return;

    // Inject @keyframes for trail particles if not already present
    const styleId = "__spoon-trail-style";
    if (!document.getElementById(styleId)) {
      const s = document.createElement("style");
      s.id = styleId;
      s.textContent = `
        @keyframes spoonTrail {
          0%   { opacity:.7; transform:translate(-50%,-50%) scale(1);  }
          100% { opacity:0;  transform:translate(-50%,-50%) scale(0);  }
        }
      `;
      document.head.appendChild(s);
    }

    const GOLD = "#D4A843";
    const cursorId = "__spoon-cursor";

    // Remove any stale cursor from a previous mount
    document.getElementById(cursorId)?.remove();

    // Build the cursor element
    const el = document.createElement("div");
    el.id = cursorId;
    el.innerHTML = `
      <svg viewBox="0 0 40 40" fill="none" style="width:100%;height:100%">
        <ellipse cx="20" cy="8" rx="7"   ry="8"   fill="${GOLD}" opacity=".95"/>
        <ellipse cx="20" cy="8" rx="5.5" ry="6.5" fill="#F0C060" opacity=".6"/>
        <rect x="18.5" y="14" width="3"   height="22" rx="1.5" fill="${GOLD}"/>
        <rect x="19.2" y="15" width="1.6" height="20" rx=".8"  fill="#F0C060" opacity=".5"/>
      </svg>
    `;
    el.style.cssText = `
      position:fixed; width:38px; height:38px; pointer-events:none;
      z-index:99999; top:0; left:0; opacity:0;
      transform:translate(-8px,-36px) rotate(-35deg);
      filter:drop-shadow(0 2px 8px rgba(212,168,67,.6));
      transition:transform .13s ease, opacity .3s, filter .13s;
    `;
    document.body.appendChild(el);

    const mouse = { x: 0, y: 0 };
    const pos   = { x: 0, y: 0 };
    let lastTrail = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      el.style.opacity = "1";

      // Particle trail
      const now = Date.now();
      if (now - lastTrail > 42) {
        lastTrail = now;
        const dot = document.createElement("div");
        dot.style.cssText = `
          position:fixed; border-radius:50%; background:${GOLD};
          pointer-events:none; left:${e.clientX}px; top:${e.clientY}px;
          width:4px; height:4px; z-index:99990;
          transform:translate(-50%,-50%);
          animation:spoonTrail .5s ease forwards;
        `;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 520);
      }
    };

    const onLeave = () => { el.style.opacity = "0"; };

    // Smooth lag follow
    const tick = () => {
      pos.x += (mouse.x - pos.x) * 0.13;
      pos.y += (mouse.y - pos.y) * 0.13;
      el.style.left = pos.x + "px";
      el.style.top  = pos.y + "px";
      raf.current = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(tick);

    // Grow on interactive elements
    const grow = () => {
      el.style.transform = "translate(-8px,-36px) rotate(-35deg) scale(1.55)";
      el.style.filter    = "drop-shadow(0 5px 22px rgba(212,168,67,1))";
    };
    const shrink = () => {
      el.style.transform = "translate(-8px,-36px) rotate(-35deg) scale(1)";
      el.style.filter    = "drop-shadow(0 2px 8px rgba(212,168,67,.6))";
    };

    const hot = document.querySelectorAll(
      "a, button, [role='button'], input, select, textarea, label"
    );
    hot.forEach(h => {
      h.addEventListener("mouseenter", grow);
      h.addEventListener("mouseleave", shrink);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
      hot.forEach(h => {
        h.removeEventListener("mouseenter", grow);
        h.removeEventListener("mouseleave", shrink);
      });
      document.getElementById(cursorId)?.remove();
    };
  }, []);
}