import { ImageResponse } from "next/og";

export const size = { width: 128, height: 128 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // no background here, so the corners stay transparent
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            borderRadius: 50,
            border: "4px solid #00e5ff",
            background:
              "radial-gradient(circle at 50% 42%, rgba(0,229,255,0.45), rgba(11,20,38,1) 75%)",
            boxShadow:
              "0 0 10px #00e5ff, 0 0 22px rgba(0,229,255,0.7), inset 0 0 18px rgba(0,229,255,0.55)",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#e8fcff",
              fontSize: 50,
              fontWeight: 900,
              letterSpacing: -2,
              textShadow: "0 0 8px #00e5ff, 0 0 18px #00e5ff, 0 0 30px #00e5ff",
            }}
          >
            AP
          </div>

          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 14,
              height: 14,
              borderRadius: 7,
              background: "#ff2d4f",
              boxShadow: "0 0 8px #ff2d4f, 0 0 16px #ff2d4f",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}