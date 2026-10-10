"use client";

import { useEffect, useRef, useState } from "react";

export default function SwingGame() {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState("Press Start, then hold to fire a web.");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const GRAVITY = 0.32;

    const g = {
      w: 0, h: 0,
      px: 0, py: 0, vx: 0, vy: 0,
      rope: null, holding: false,
      anchors: [], items: [], trail: [],
      camX: 0, nextAnchorX: 0, nextItemX: 0,
      frame: 0, packets: 0, shown: 0,
      running: false, over: false, raf: 0,
      bestScore: 0,
    };
    gameRef.current = g;

    function populate() {
      const limit = g.camX + g.w + 320;
      while (g.nextAnchorX < limit) {
        g.anchors.push({
          x: g.nextAnchorX,
          y: 30 + Math.random() * Math.max(30, g.h * 0.22),
        });
        g.nextAnchorX += 130 + Math.random() * 90;
      }
      while (g.nextItemX < limit) {
        const chance = Math.min(0.25 + g.frame / 6000, 0.55);
        const threat = Math.random() < chance;
        g.items.push({
          x: g.nextItemX,
          y: g.h * 0.38 + Math.random() * g.h * 0.45,
          type: threat ? "threat" : "packet",
          r: threat ? 11 : 7,
        });
        g.nextItemX += 170 + Math.random() * 140;
      }
    }

    function pickAnchor() {
      let best = null;
      let bestScore = Infinity;
      for (const a of g.anchors) {
        const dx = a.x - g.px;
        const dy = a.y - g.py;
        if (dy > -30) continue;
        if (dx < -20 || dx > 260) continue;
        const d = Math.hypot(dx, dy);
        if (d > 300) continue;
        const s = Math.abs(dx - 90) + Math.abs(dy) * 0.3;
        if (s < bestScore) { bestScore = s; best = a; }
      }
      return best;
    }

    function reset() {
      g.anchors = [];
      g.items = [];
      g.trail = [];
      g.rope = null;
      g.holding = false;
      g.frame = 0;
      g.packets = 0;
      g.shown = 0;
      g.px = 70;
      g.py = g.h * 0.4;
      g.vx = 3;
      g.vy = 0;
      g.camX = g.px - g.w * 0.3;
      g.anchors.push({ x: 120, y: 50 });
      g.nextAnchorX = 120 + 150;
      g.nextItemX = 420;
      populate();
    }

    function press() {
      if (!g.running) return;
      g.holding = true;
      if (g.rope) return;
      const a = pickAnchor();
      if (a) {
        const len = Math.max(60, Math.hypot(a.x - g.px, a.y - g.py));
        g.rope = { a, len };
      }
    }

    function release() {
      if (!g.holding) return;
      g.holding = false;
      g.rope = null;
    }

    function endRound() {
      g.running = false;
      g.over = true;
      g.rope = null;
      const finalScore = Math.floor((g.px - 70) / 40) + g.packets * 5;
      if (finalScore > g.bestScore) {
        g.bestScore = finalScore;
        setBest(finalScore);
      }
      setStatus(`Signal lost. Final score ${finalScore}. Try again?`);
      draw();
    }

    function step() {
      g.frame += 1;

      g.vy += GRAVITY;
      if (g.rope) g.vx += 0.025;
      else if (g.vx < 2.2) g.vx += 0.03;
      g.vx *= 0.999;

      g.px += g.vx;
      g.py += g.vy;

      if (g.rope) {
        const { a, len } = g.rope;
        const dx = g.px - a.x;
        const dy = g.py - a.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d > len) {
          const nx = dx / d;
          const ny = dy / d;
          g.px = a.x + nx * len;
          g.py = a.y + ny * len;
          const vn = g.vx * nx + g.vy * ny;
          if (vn > 0) {
            g.vx -= vn * nx;
            g.vy -= vn * ny;
          }
        }
      }

      g.vx = Math.min(g.vx, 9);
      g.vy = Math.max(-12, Math.min(g.vy, 14));

      if (g.py < 10) { g.py = 10; g.vy = Math.abs(g.vy) * 0.3; }

      g.trail.push({ x: g.px, y: g.py });
      if (g.trail.length > 16) g.trail.shift();

      g.camX = Math.max(g.camX, g.px - g.w * 0.3);
      populate();

      g.anchors = g.anchors.filter((a) => a.x > g.camX - 160 || (g.rope && g.rope.a === a));
      g.items = g.items.filter((it) => it.x > g.camX - 60);

      for (const it of g.items) {
        if (Math.hypot(it.x - g.px, it.y - g.py) < it.r + 8) {
          if (it.type === "threat") { endRound(); return false; }
          it.taken = true;
          g.packets += 1;
        }
      }
      g.items = g.items.filter((it) => !it.taken);

      if (g.py > g.h + 20) { endRound(); return false; }

      const sc = Math.floor((g.px - 70) / 40) + g.packets * 5;
      if (sc !== g.shown) { g.shown = sc; setScore(sc); }
      return true;
    }

    function drawAgent(x, y) {
      const roped = !!g.rope;
      const lean = roped
        ? Math.atan2(g.rope.a.y - g.py, g.rope.a.x - g.px) + Math.PI / 2
        : Math.atan2(g.vy, g.vx) * 0.6;
      const kick = roped ? 0.15 : Math.sin(g.frame / 5) * 0.55;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(lean);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 10;

      // legs
      ctx.strokeStyle = "#13264d";
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(-2, 6);
      ctx.lineTo(-5 - kick * 6, 17);
      ctx.moveTo(2, 6);
      ctx.lineTo(5 + kick * 6, 17);
      ctx.stroke();

      // rear arm
      ctx.beginPath();
      ctx.moveTo(-3, -4);
      ctx.lineTo(roped ? -9 : -10 - kick * 4, roped ? 3 : 4 + kick * 4);
      ctx.stroke();

      // torso
      ctx.fillStyle = "#0b1226";
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-6, -6);
      ctx.lineTo(6, -6);
      ctx.lineTo(4, 8);
      ctx.lineTo(-4, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // chest light
      ctx.fillStyle = "#35ff9b";
      ctx.shadowColor = "#35ff9b";
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();

      // front arm: reaches up toward the web when swinging
      ctx.shadowColor = "#00e5ff";
      ctx.strokeStyle = "#13264d";
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(3, -4);
      ctx.lineTo(roped ? 4 : 11 + kick * 3, roped ? -17 : -8 + kick * 3);
      ctx.stroke();

      // head + visor
      ctx.fillStyle = "#0b1226";
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, -12, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#00e5ff";
      ctx.shadowBlur = 8;
      ctx.fillRect(-1, -14, 6.5, 3);

      ctx.restore();
    }

    function draw() {
      const { w, h } = g;
      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#050914");
      bg.addColorStop(1, "#0b1530");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // scrolling grid
      ctx.strokeStyle = "rgba(0,229,255,.07)";
      ctx.lineWidth = 1;
      const gx = -((g.camX * 0.6) % 36);
      for (let x = gx; x < w; x += 36) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 36) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // parallax skyline
      const par = g.camX * 0.35;
      ctx.fillStyle = "rgba(20,36,70,.8)";
      const first = Math.floor(par / 46);
      for (let i = -1; i < w / 46 + 2; i++) {
        const idx = first + i;
        const bh = 40 + ((((idx * 7919) % 13) + 13) % 13) * 9;
        ctx.fillRect(idx * 46 - par, h - bh, 40, bh);
      }

      const sx = (x) => x - g.camX;

      // anchors
      const target = g.running && !g.rope ? pickAnchor() : null;
      for (const a of g.anchors) {
        const isTarget = a === target;
        ctx.strokeStyle = isTarget ? "#00e5ff" : "rgba(230,237,246,.45)";
        ctx.lineWidth = isTarget ? 2 : 1;
        ctx.beginPath(); ctx.arc(sx(a.x), a.y, isTarget ? 9 : 6, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = isTarget ? "#00e5ff" : "rgba(230,237,246,.7)";
        ctx.beginPath(); ctx.arc(sx(a.x), a.y, 2.5, 0, Math.PI * 2); ctx.fill();
      }

      // items
      const pulse = 1 + Math.sin(g.frame / 8) * 0.12;
      for (const it of g.items) {
        const x = sx(it.x);
        if (it.type === "threat") {
          ctx.fillStyle = "#ff2d4f";
          ctx.shadowColor = "#ff2d4f";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(x, it.y - it.r * pulse);
          ctx.lineTo(x + it.r * pulse, it.y);
          ctx.lineTo(x, it.y + it.r * pulse);
          ctx.lineTo(x - it.r * pulse, it.y);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "rgba(255,45,79,.5)";
          ctx.beginPath(); ctx.arc(x, it.y, it.r + 6, 0, Math.PI * 2); ctx.stroke();
        } else {
          ctx.fillStyle = "#35ff9b";
          ctx.shadowColor = "#35ff9b";
          ctx.shadowBlur = 10;
          ctx.fillRect(x - it.r * 0.7, it.y - it.r * 0.7, it.r * 1.4 * pulse, it.r * 1.4 * pulse);
          ctx.shadowBlur = 0;
        }
      }

      // trail
      for (let i = 0; i < g.trail.length; i++) {
        const t = g.trail[i];
        ctx.fillStyle = `rgba(0,229,255,${(i / g.trail.length) * 0.35})`;
        ctx.beginPath(); ctx.arc(sx(t.x), t.y, 2 + (i / g.trail.length) * 4, 0, Math.PI * 2); ctx.fill();
      }

      // web strand
      if (g.rope) {
        ctx.strokeStyle = "rgba(230,237,246,.95)";
        ctx.lineWidth = 1.6;
        ctx.shadowColor = "#e6edf6";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(sx(g.rope.a.x), g.rope.a.y);
        ctx.lineTo(sx(g.px), g.py);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // player character
      drawAgent(sx(g.px), g.py);

      // packets HUD
      ctx.fillStyle = "#35ff9b";
      ctx.font = "600 11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`PACKETS ${g.packets}`, 12, h - 12);

      if (!g.running) {
        ctx.fillStyle = "rgba(5,8,15,.72)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#e6edf6";
        ctx.textAlign = "center";
        ctx.font = "600 15px sans-serif";
        ctx.fillText(g.over ? "Signal lost — try again?" : "Ready when you are", w / 2, h / 2);
      }
    }

    function loop() {
      if (!g.running) return;
      if (step()) {
        draw();
        g.raf = requestAnimationFrame(loop);
      }
    }

    function resize() {
      const b = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      g.w = b.width;
      g.h = b.height;
      canvas.width = Math.round(b.width * ratio);
      canvas.height = Math.round(b.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!g.running) {
        reset();
        draw();
      }
    }

    g.press = press;
    g.release = release;
    g.start = () => {
      cancelAnimationFrame(g.raf);
      reset();
      g.over = false;
      g.running = true;
      // begin attached to the first anchor so the round opens with a swing
      const a = g.anchors[0];
      g.rope = { a, len: Math.max(60, Math.hypot(a.x - g.px, a.y - g.py)) };
      setScore(0);
      setStatus("Hold to fire a web. Release to launch. Grab green, dodge red.");
      g.raf = requestAnimationFrame(loop);
    };

    function isTyping() {
      return ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName);
    }
    function isSwingKey(e) {
      const k = e.key.toLowerCase();
      return e.code === "Space" || e.key === "ArrowUp" || k === "w";
    }
    function onKeyDown(e) {
      if (!g.running || isTyping() || !isSwingKey(e)) return;
      e.preventDefault();
      if (!e.repeat) press();
    }
    function onKeyUp(e) {
      if (!g.running || !isSwingKey(e)) return;
      release();
    }
    function onDown(e) { e.preventDefault(); press(); }
    function onUp() { release(); }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(g.raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <article className="panel game-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">WEB SWING · BROWSER GAME</p>
          <h3>Web Runner</h3>
        </div>
        <div className="game-score">
          SCORE<strong>{String(score).padStart(2, "0")}</strong>
          <small className="best-score">BEST {String(best).padStart(2, "0")}</small>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="game-canvas"
        aria-label="Hold to fire a web and swing between anchor nodes. Collect green packets and avoid red firewalls."
      />

      <p className="game-status" aria-live="polite">{status}</p>

      <div className="game-controls">
        <button
          className="button button-outline swing-button"
          type="button"
          onPointerDown={(e) => { e.preventDefault(); gameRef.current?.press(); }}
          onPointerUp={() => gameRef.current?.release()}
          onPointerLeave={() => gameRef.current?.release()}
          onPointerCancel={() => gameRef.current?.release()}
        >
          Hold to swing
        </button>
        <button className="button button-solid" type="button" onClick={() => gameRef.current?.start()}>
          Start game
        </button>
      </div>

      <p className="fine-print">
        Hold mouse, Space, ↑ or W to fire a web. Release to launch. On touchscreens, press and hold the canvas or the swing button.
      </p>
    </article>
  );
}