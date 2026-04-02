import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Stars */}
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
              borderRadius: "50%",
              background: i % 5 === 0 ? "#00F0FF" : "white",
              opacity: 0.3 + (i % 7) * 0.1,
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
            }}
          />
        ))}

        {/* Earth */}
        <div
          style={{
            position: "absolute",
            left: "80px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1a6dd4 0%, #0d4a2e 50%, #1a6dd4 100%)",
            boxShadow: "0 0 60px rgba(26, 109, 212, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "80px",
          }}
        >
          🌍
        </div>

        {/* Trajectory arc */}
        <svg
          width="600"
          height="200"
          viewBox="0 0 600 200"
          style={{ position: "absolute", left: "250px", top: "50%", transform: "translateY(-50%)" }}
        >
          <path
            d="M 0 100 Q 300 -80 600 100"
            stroke="#00F0FF"
            strokeWidth="3"
            fill="none"
            strokeDasharray="12,8"
          />
          <circle cx="300" cy="12" r="6" fill="#FFB800" />
        </svg>

        {/* Moon */}
        <div
          style={{
            position: "absolute",
            right: "80px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #d4d4d4 0%, #888 50%, #d4d4d4 100%)",
            boxShadow: "0 0 40px rgba(200, 200, 200, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "60px",
          }}
        >
          🌑
        </div>

        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "white",
              letterSpacing: "4px",
              fontFamily: "monospace",
            }}
          >
            INFINITE ORBIT
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#00F0FF",
              marginTop: "8px",
              fontFamily: "monospace",
            }}
          >
            🚀 Recreate the Artemis II Moon Mission
          </div>
        </div>

        {/* Bottom text */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
          }}
        >
          Combine physics primitives to discover orbital mechanics
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
