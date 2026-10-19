// BOM — Zustand com seletores: cada componente assina SÓ o que usa.
// Sem Provider. Só relógio/progresso re-renderizam no tick; a grade fica parada.
import { useEffect, useState } from "react";
import { create } from "zustand";
import { RenderCounter } from "../../components/RenderCounter";

// Store em ~15 linhas, pronta p/ print de slide.
type Store = { theme: string; user: string; ticker: number; tick: () => void };
export const useStore = create<Store>((set) => ({
  theme: "claro",
  user: "ana",
  ticker: 0,
  tick: () => set((s) => ({ ticker: s.ticker + 1 })),
}));

function burn(ms: number) {
  const s = performance.now();
  while (performance.now() - s < ms) { /* mesmo custo da versão ruim */ }
}

// Assina só theme: NÃO re-renderiza quando ticker muda.
function GridItem() {
  const theme = useStore((s) => s.theme);
  burn(0.12);
  return (
    <div className="tick-box">
      <RenderCounter label="r" /> <span className="muted">{theme}</span>
    </div>
  );
}

function Clock() {
  const ticker = useStore((s) => s.ticker);
  return <strong>relógio: {ticker}</strong>;
}

function Progress() {
  const ticker = useStore((s) => s.ticker);
  return (
    <div style={{ height: 8, background: "#e2e8f0", borderRadius: 99, overflow: "hidden", marginTop: 6 }}>
      <div style={{ width: `${ticker % 100}%`, height: "100%", background: "#16a34a" }} />
    </div>
  );
}

export function ZustandGood() {
  const tick = useStore((s) => s.tick);
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(200);
  const [probe, setProbe] = useState("");

  useEffect(() => {
    if (!running) return;
    const t = setInterval(tick, 16);
    return () => clearInterval(t);
  }, [running, tick]);

  return (
    <div className="card">
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <strong>Zustand (bom)</strong>
        <RenderCounter label="renders painel" />
        <button type="button" className="btn btn-good" onClick={() => setRunning((r) => !r)}>
          {running ? "Pausar ticker" : "Iniciar ticker (16ms)"}
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
        <label className="muted">
          Componentes: {count}
          <input type="range" min={50} max={2000} step={50} value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </label>
        <input
          className="heavy-field"
          style={{ maxWidth: 260 }}
          placeholder="Digite aqui com o ticker ligado…"
          value={probe}
          onChange={(e) => setProbe(e.target.value)}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <Clock />
        <Progress />
      </div>
      <p className="muted">Mesmos controles, mesma carga. Só quem usa <code>ticker</code> re-renderiza.</p>
      <div className="tick-grid">
        {Array.from({ length: count }).map((_, i) => <GridItem key={i} />)}
      </div>
    </div>
  );
}
