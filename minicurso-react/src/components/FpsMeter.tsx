// BOM — mede FPS com requestAnimationFrame, fixo no canto da tela.
// Fica vermelho abaixo de 30 FPS. Presente em todas as abas.
import { useEffect, useState } from "react";

export function FpsMeter({ position = "right" }: { position?: "right" | "left" }) {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      frames += 1;
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const low = fps < 30;

  return (
    <div
      title="Frames por segundo (requestAnimationFrame)"
      style={{
        position: "fixed",
        ...(position === "left" ? { left: 12 } : { right: 12 }),
        bottom: 12,
        zIndex: 50,
        fontFamily: "ui-monospace, Consolas, monospace",
        fontSize: 13,
        fontWeight: 700,
        padding: "6px 12px",
        borderRadius: 10,
        border: `1px solid ${low ? "#fecaca" : "#bbf7d0"}`,
        background: low ? "#fef2f2" : "#f0fdf4",
        color: low ? "#b91c1c" : "#15803d",
        boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
      }}
    >
      {fps} FPS{low ? " — travando" : ""}
    </div>
  );
}
