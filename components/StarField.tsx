"use client";

export default function StarField() {
  const stars = Array.from({ length: 120 }, (_, i) => {
    const size = i % 7 === 0 ? "3px" : i % 4 === 0 ? "2.5px" : i % 3 === 0 ? "2px" : "1.5px";
    return {
      left: `${(i * 31 + 7) % 100}%`,
      top: `${(i * 47 + 13) % 100}%`,
      width: size,
      height: size,
      animationDelay: `${((i * 200) % 5000) / 1000}s`,
      animationDuration: `${2.5 + (i % 5)}s`,
    };
  });

  return (
    <div className="star-field">
      {stars.map((style, i) => (
        <div key={i} className="star" style={style} />
      ))}
    </div>
  );
}
