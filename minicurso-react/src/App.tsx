import { useCallback, useEffect, useState } from "react";
import { FpsMeter } from "./components/FpsMeter";
import { RenderCounter } from "./components/RenderCounter";
import { SlidesPanel } from "./components/SlidesPanel";
import { StylingDemo } from "./demos/01-styling";
import { FormsDemo } from "./demos/02-forms";
import { StateDemo } from "./demos/03-state";
import { DataDemo } from "./demos/04-data";
import { ChartsDemo } from "./demos/05-charts";
import "./App.css";

type DemoId = "inicio" | "estilizacao" | "formularios" | "estado" | "dados" | "graficos";

const DEMOS: { id: DemoId; numero: string; titulo: string; subtitulo: string }[] = [
  { id: "inicio", numero: "●", titulo: "Início", subtitulo: "Roteiro da apresentação" },
  { id: "estilizacao", numero: "1", titulo: "Estilização", subtitulo: "styled × antd × shadcn" },
  { id: "formularios", numero: "2", titulo: "Formulários", subtitulo: "useState × RHF × Zod" },
  { id: "estado", numero: "3", titulo: "Estado", subtitulo: "Context × Zustand" },
  { id: "dados", numero: "4", titulo: "Dados", subtitulo: "useEffect × TanStack Query" },
  { id: "graficos", numero: "5", titulo: "Gráficos", subtitulo: "Apex × ECharts" },
];

const SLIDES_OPEN_KEY = "minicurso:slides:open";
const SLIDES_PAGE_KEY = "minicurso:slides:page";
const SLIDES_FLOAT_KEY = "minicurso:slides:float";

function idFromHash(): DemoId {
  const slug = window.location.hash.replace("#/", "").replace("#", "");
  return (DEMOS.some((d) => d.id === slug) ? slug : "inicio") as DemoId;
}

function Inicio() {
  return (
    <section>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>React do tutorial ao mercado — demos ao vivo</h2>
        <RenderCounter label="renders" />
      </div>
      <p className="muted">
        Cada aba tem uma versão <strong>ruim</strong> (tutorial / legado) e uma <strong>boa</strong>{" "}
        (padrão atual). O problema da versão ruim é visível: contador de renders, FPS, lag ao
        digitar. Use as teclas <kbd>1</kbd>–<kbd>5</kbd> ou <kbd>0</kbd> para trocar de aba no
        projetor e <kbd>S</kbd> para abrir os slides ao lado. A URL também funciona:{" "}
        <code>#/estado</code>, <code>#/dados</code>, etc.
      </p>
      <div className="grid-3" style={{ marginTop: 16 }}>
        {DEMOS.filter((d) => d.id !== "inicio").map((d) => (
          <a key={d.id} href={`#/${d.id}`} className="card link-card">
            <span className="badge">{d.numero}</span>
            <strong>{d.titulo}</strong>
            <span className="muted">{d.subtitulo}</span>
          </a>
        ))}
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <strong>Roteiro sugerido (bate com os slides)</strong>
        <ol className="muted" style={{ marginBottom: 0, paddingLeft: 20 }}>
          <li>Estilização: DevTools → Elements, classes com hash × utilitárias.</li>
          <li>Formulários: digite no campo ruim (tudo re-renderiza) vs. RHF (nada re-renderiza).</li>
          <li>Estado: ligue o ticker com 500+ itens, digite no input — Context trava, Zustand não.</li>
          <li>Dados: clique rápido entre posts com atraso ligado — race condition vs. cache.</li>
          <li>Gráficos: suba de 1k → 20k → 100k pontos — SVG sofre, Canvas aguenta.</li>
        </ol>
      </div>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState<DemoId>(() => idFromHash());
  const [slidesOpen, setSlidesOpen] = useState(() => {
    const forced = new URLSearchParams(window.location.search).get("slides");
    if (forced !== null) return forced !== "0";
    return localStorage.getItem(SLIDES_OPEN_KEY) === "1";
  });
  const [slidePage, setSlidePage] = useState(() =>
    Math.max(1, Number(localStorage.getItem(SLIDES_PAGE_KEY)) || 1),
  );
  const [slidesTotal, setSlidesTotal] = useState<number | null>(null);
  const [slidesFloating, setSlidesFloating] = useState(
    () => localStorage.getItem(SLIDES_FLOAT_KEY) === "1",
  );

  const go = useCallback((id: DemoId) => {
    setActive(id);
    window.location.hash = id === "inicio" ? "/" : `/${id}`;
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const onHash = () => setActive(idFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Painel de slides: lembra aberto/fechado, flutuante e a página entre visitas
  useEffect(() => {
    localStorage.setItem(SLIDES_OPEN_KEY, slidesOpen ? "1" : "0");
    localStorage.setItem(SLIDES_PAGE_KEY, String(slidePage));
    localStorage.setItem(SLIDES_FLOAT_KEY, slidesFloating ? "1" : "0");
  }, [slidesOpen, slidePage, slidesFloating]);

  // Quando o PDF termina de carregar, limita a página guardada ao total
  const handleTotal = useCallback((n: number) => {
    setSlidesTotal(n);
    setSlidePage((p) => Math.min(p, n));
  }, []);

  // Atalhos de teclado p/ apresentação: 0 = início, 1..5 = demos,
  // S = painel de slides, ←/→ e PgUp/PgDn = página (só com o painel aberto)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
        return;
      const order: DemoId[] = ["inicio", "estilizacao", "formularios", "estado", "dados", "graficos"];
      if (e.key >= "0" && e.key <= "5") {
        go(order[Number(e.key)]);
        return;
      }
      if (e.key === "s" || e.key === "S") {
        setSlidesOpen((v) => !v);
        return;
      }
      if (!slidesOpen) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        setSlidePage((p) => Math.min(p + 1, slidesTotal ?? p + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setSlidePage((p) => Math.max(1, p - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, slidesOpen, slidesTotal]);

  const slidesPanel = slidesOpen ? (
    <SlidesPanel
      page={slidePage}
      floating={slidesFloating}
      onToggleFloat={() => setSlidesFloating((v) => !v)}
      onTotal={handleTotal}
      onPrev={() => setSlidePage((p) => Math.max(1, p - 1))}
      onNext={() => setSlidePage((p) => Math.min(p + 1, slidesTotal ?? p + 1))}
      onClose={() => setSlidesOpen(false)}
    />
  ) : null;

  return (
    <div className={`layout ${slidesOpen && !slidesFloating ? "slides-open" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-dot" aria-hidden />
          <div>
            <strong>Minicurso React</strong>
            <span className="muted">tutorial → mercado</span>
          </div>
        </div>
        <nav aria-label="Demos do minicurso">
          {DEMOS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => go(d.id)}
              aria-current={active === d.id ? "page" : undefined}
              className={`nav-btn ${active === d.id ? "active" : ""}`}
            >
              <span className="nav-num">{d.numero}</span>
              <span className="nav-text">
                <strong>{d.titulo}</strong>
                <small>{d.subtitulo}</small>
              </span>
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setSlidesOpen((v) => !v)}
          aria-pressed={slidesOpen}
          className={`nav-btn ${slidesOpen ? "active" : ""}`}
        >
          <span className="nav-num">S</span>
          <span className="nav-text">
            <strong>Slides</strong>
            <small>{slidesOpen ? "fechar painel" : "PDF lado a lado"}</small>
          </span>
        </button>
        <p className="muted sidebar-hint">
          Atalhos <kbd>0</kbd>–<kbd>5</kbd> • <kbd>S</kbd> slides • URL <code>#/demo</code>
        </p>
      </aside>

      <main className="content">
        {active === "inicio" && <Inicio />}
        {active === "estilizacao" && <StylingDemo />}
        {active === "formularios" && <FormsDemo />}
        {active === "estado" && <StateDemo />}
        {active === "dados" && <DataDemo />}
        {active === "graficos" && <ChartsDemo />}
      </main>

      {slidesPanel}

      <FpsMeter position={slidesOpen && !slidesFloating ? "left" : "right"} />
    </div>
  );
}
