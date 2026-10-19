// RUIM — um único AppContext com { theme, user, ticker }.
// Qualquer mudança no valor re-renderiza TODOS os consumidores,
// mesmo quem só lê theme. Com ticker a 16ms + 500 itens, o input trava.
import { createContext, useContext, useEffect, useState } from "react";
import { RenderCounter } from "../../components/RenderCounter";

type Ctx = { theme: string; user: string; ticker: number };
const AppContext = createContext<Ctx>({ theme: "claro", user: "ana", ticker: 0 });

function burn(ms: number) {
  const s = performance.now();
  while (performance.now() - s < ms) { /* custo leve p/ evidenciar renders */ }
}

// Só precisa de theme, mas assina o contexto inteiro → re-renderiza a cada tick.
function GridItem() {
  const { theme } = useContext(AppContext);
  burn(0.12);
  return (
    <div className="tick-box">
      <RenderCounter label="r" /> <span className="muted">{theme}</span>
    </div>
  );
}

function Clock() {
  const { ticker } = useContext(AppContext);
  return <strong>relógio: {ticker}</strong>;
}

function Progress() {
  const { ticker } = useContext(AppContext);
  return (
    <div style={{ height: 8, background: "#e2e8f0", borderRadius: 99, overflow: "hidden", marginTop: 6 }}>
      <div style={{ width: `${ticker % 100}%`, height: "100%", background: "#4f46e5" }} />
    </div>
  );
}

export function ContextBad() {
  const [ticker, setTicker] = useState(0);
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(200);
  const [probe, setProbe] = useState("");

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTicker((v) => v + 1), 16);
    return () => clearInterval(t);
  }, [running]);

  return (
    <AppContext.Provider value={{ theme: "claro", user: "ana", ticker }}>
      <div className="card">
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <strong>Context (ruim)</strong>
          <RenderCounter label="renders painel" />
          <button type="button" className="btn" onClick={() => setRunning((r) => !r)}>
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
        <p className="muted">Todos os {count} itens assinam o contexto inteiro: todos re-renderizam a cada tick.</p>
        <div className="tick-grid">
          {Array.from({ length: count }).map((_, i) => <GridItem key={i} />)}
        </div>
      </div>
    </AppContext.Provider>
  );
}
