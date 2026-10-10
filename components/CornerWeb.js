export default function CornerWeb({ className = "" }) {
  const angles = [0, 15, 30, 45, 60, 75, 90];
  const radii = [50, 100, 150, 200, 250];
  const pt = (r, a) => [
    +(r * Math.cos((a * Math.PI) / 180)).toFixed(1),
    +(r * Math.sin((a * Math.PI) / 180)).toFixed(1),
  ];

  const arcs = radii.map((r) => {
    let d = `M ${pt(r, 0).join(" ")}`;
    for (let i = 0; i < angles.length - 1; i++) {
      const mid = (angles[i] + angles[i + 1]) / 2;
      const c = pt(r * 0.84, mid);
      const e = pt(r, angles[i + 1]);
      d += ` Q ${c.join(" ")} ${e.join(" ")}`;
    }
    return d;
  });

  return (
    <svg
      className={`corner-web ${className}`}
      viewBox="0 0 260 260"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      {angles.map((a) => (
        <line key={a} x1="0" y1="0" x2={pt(250, a)[0]} y2={pt(250, a)[1]} />
      ))}
      {arcs.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}