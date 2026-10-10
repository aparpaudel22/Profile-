"use client";

import { useEffect, useRef, useState } from "react";

export default function DiscCover({ src, title, playing }) {
  const [failed, setFailed] = useState(false);
  const discRef = useRef(null);
  const ringRef = useRef(null);
  const discAngle = useRef(0);
  const ringAngle = useRef(0);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  // Rotation is driven by JavaScript, so it keeps its angle when paused
  // and does not depend on any CSS animation rules.
  useEffect(() => {
    if (!playing) return;

    let raf = 0;
    let last = performance.now();

    function tick(now) {
      const dt = now - last;
      last = now;

      discAngle.current = (discAngle.current + dt * 0.04) % 360;   // one turn per 9s
      ringAngle.current = (ringAngle.current - dt * 0.02) % 360;   // slower, opposite way

      if (discRef.current) discRef.current.style.transform = `rotate(${discAngle.current}deg)`;
      if (ringRef.current) ringRef.current.style.transform = `rotate(${ringAngle.current}deg)`;

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <div className="dc-stage">
      <style>{`
        .dc-stage {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 220px;
          margin: 16px 0 8px;
        }
        .dc-ring {
          position: absolute;
          width: 200px;
          height: 200px;
          border: 1px dashed rgba(0, 229, 255, 0.45);
          border-radius: 50%;
        }
        .dc-disc {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 170px;
          height: 170px;
          overflow: hidden;
          border: 2px solid #00e5ff;
          border-radius: 50%;
          background: #0b1426;
          box-shadow: 0 0 36px rgba(0, 229, 255, 0.45);
          will-change: transform;
        }
        .dc-disc img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .dc-fallback {
          color: #00e5ff;
          font-size: 56px;
          text-shadow: 0 0 18px rgba(0, 229, 255, 0.6);
        }
        .dc-grooves {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: repeating-radial-gradient(circle, transparent 0 7px, rgba(0, 0, 0, 0.12) 7px 8px);
          pointer-events: none;
        }
        .dc-hole {
          position: absolute;
          width: 26px;
          height: 26px;
          border: 2px solid #00e5ff;
          border-radius: 50%;
          background: #05080f;
        }
      `}</style>

      <span className="dc-ring" ref={ringRef} />
      <div className="dc-disc" ref={discRef}>
        {src && !failed ? (
          <img src={src} alt={`Cover art for ${title}`} onError={() => setFailed(true)} />
        ) : (
          <span className="dc-fallback" aria-hidden="true">♫</span>
        )}
                <span className="dc-grooves" />
        <span className="dc-hole" />
      </div>
      {(!src || failed) && (
        <p style={{ position: "absolute", bottom: -6, fontSize: 10, color: "#ff2d4f", fontFamily: "monospace" }}>
          {!src ? "No cover set in data.js" : `Cannot load: ${src}`}
        </p>
      )}
    </div>
  );
}