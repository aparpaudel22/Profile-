"use client";

import { useEffect, useRef } from "react";

export default function WebBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, raf = 0;
    let nodes = [];
    let shots = [];
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.floor((w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    }

    function onMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    // Click: shoot a web strand from the nearest bottom corner, then it splats.
    function onClick(e) {
      if (reduce) return;
      shots.push({
        sx: e.clientX < w / 2 ? 0 : w,
        sy: h,
        tx: e.clientX,
        ty: e.clientY,
        t: 0,
        life: 1,
      });
    }

    function drawSplat(s) {
      const alpha = s.life;
      ctx.strokeStyle = `rgba(230,237,246,${0.75 * alpha})`;
      ctx.lineWidth = 1;
      const spokes = 9;
      const rings = [10, 22, 36];
      for (let i = 0; i < spokes; i++) {
        const a = (i / spokes) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(s.tx, s.ty);
        ctx.lineTo(s.tx + Math.cos(a) * 44, s.ty + Math.sin(a) * 44);
        ctx.stroke();
      }
      for (const r of rings) {
        ctx.beginPath();
        for (let i = 0; i <= spokes; i++) {
          const a = (i / spokes) * Math.PI * 2;
          const rr = r * (i % 2 ? 0.86 : 1);
          const x = s.tx + Math.cos(a) * rr;
          const y = s.ty + Math.sin(a) * rr;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
        }
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // node-to-node web lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            ctx.strokeStyle = `rgba(0,229,255,${(1 - d / 140) * 0.28})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // cursor strands (red)
      for (const n of nodes) {
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (d < 190) {
          ctx.strokeStyle = `rgba(255,45,79,${(1 - d / 190) * 0.65})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = "rgba(0,229,255,.7)";
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // web shots
      shots = shots.filter((s) => s.life > 0);
      for (const s of shots) {
        if (s.t < 1) {
          s.t = Math.min(1, s.t + 0.07);
          const x = s.sx + (s.tx - s.sx) * s.t;
          const y = s.sy + (s.ty - s.sy) * s.t;
          ctx.strokeStyle = "rgba(230,237,246,.9)";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(s.sx, s.sy);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          s.life -= 0.012;
          ctx.strokeStyle = `rgba(230,237,246,${0.5 * s.life})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(s.sx, s.sy);
          ctx.lineTo(s.tx, s.ty);
          ctx.stroke();
          drawSplat(s);
        }
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return <canvas ref={ref} className="web-bg" aria-hidden="true" />;
}