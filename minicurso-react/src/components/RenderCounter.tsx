// BOM — badge simples que mostra quantas vezes o componente pai renderizou.
// Importante: incrementa durante o render (useRef), não em useEffect.
// (O lint reclama de ler ref no render — aqui é intencional.)
import { useRef } from "react";

export function RenderCounter({ label = "renders" }: { label?: string }) {
  const count = useRef(0);
  count.current += 1;

  return (
    <span
      title="Quantas vezes este componente renderizou"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontFamily: "ui-monospace, Consolas, monospace",
        background: "#eef2ff",
        color: "#3730a3",
        border: "1px solid #c7d2fe",
        borderRadius: 999,
        padding: "2px 10px",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#6366f1",
          display: "inline-block",
        }}
      />
      {label}: {count.current}
    </span>
  );
}
