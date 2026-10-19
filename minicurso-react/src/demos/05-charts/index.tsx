// Demo 5 — gráficos: o MESMO dataset (random walk) alimenta Apex (SVG) e ECharts (Canvas).
// O tempo mostrado é do dataset novo até o primeiro paint, medido igual nos dois (useRenderTime).
import { useEffect, useMemo, useState } from "react";
import { RenderCounter } from "../../components/RenderCounter";
import { APEX_LIMIT, ApexDemo } from "./ApexDemo";
import { EchartsDemo } from "./EchartsDemo";
import "./charts.css";

const VOLUMES = [1_000, 20_000, 100_000] as const;

type Timing = { apex: number | null; echarts: number | null };

// Random walk simples — série de MRR fictícia. O custo de geração roda uma vez por volume (useMemo).
function generateSeries(n: number): number[] {
  const data = new Array<number>(n);
  let value = 42_000;
  for (let i = 0; i < n; i++) {
    value += (Math.random() - 0.5) * 40 + Math.sin(i / 600) * 1.5;
    data[i] = Math.round(value * 100) / 100;
  }
  return data;
}

const fmtInt = (n: number) => n.toLocaleString("pt-BR");
const fmtMs = (ms: number | null | undefined) =>
  ms == null ? "—" : `${ms.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} ms`;

export function ChartsDemo() {
  const [request, setRequest] = useState<{ volume: number; seed: number }>({
    volume: VOLUMES[0],
    seed: 0,
  });
  const [timings, setTimings] = useState<Record<number, Timing>>({
    [VOLUMES[0]]: { apex: null, echarts: null },
  });
  const volume = request.volume;

  const data = useMemo(() => generateSeries(request.volume), [request]);

  // O Apex recebe o dataset ~2 frames depois do ECharts: as medições não se
  // sobrepõem e um render pesado do Apex não infla o tempo medido do ECharts.
  const [apexData, setApexData] = useState(data);
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setApexData(data));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [data]);

  const changeVolume = (n: number) => {
    setRequest((r) => ({ volume: n, seed: r.seed + 1 })); // clicar de novo no mesmo volume regenera e mede outra vez
    setTimings((prev) => ({ ...prev, [n]: { apex: null, echarts: null } }));
  };

  const reportApex = (ms: number) =>
    setTimings((prev) => ({
      ...prev,
      [volume]: { apex: ms, echarts: prev[volume]?.echarts ?? null },
    }));

  const reportEcharts = (ms: number) =>
    setTimings((prev) => ({
      ...prev,
      [volume]: { apex: prev[volume]?.apex ?? null, echarts: ms },
    }));

  const cell = (n: number, chart: "apex" | "echarts") => {
    if (chart === "apex" && n > APEX_LIMIT) return "—"; // cap: o Apex não renderiza o volume pedido
    const timing = timings[n];
    if (!timing) return "—"; // volume nunca medido
    return timing[chart] == null ? "medindo…" : fmtMs(timing[chart]);
  };

  return (
    <section>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>5. Gráficos: ApexCharts × ECharts</h2>
        <RenderCounter label="renders da aba" />
      </div>
      <p className="muted">
        Mesmo dataset nos dois gráficos, com o tempo de renderização medido igualmente (do
        dataset ao primeiro paint). Apex (SVG) para dado agregado; ECharts (Canvas) para volume
        alto. Suba para 20.000 e 100.000, dê zoom no ECharts e repare no FPS.
      </p>

      <div className="tabs" role="group" aria-label="Quantidade de pontos">
        {VOLUMES.map((n) => (
          <button
            key={n}
            type="button"
            className={`tab ${volume === n ? "active" : ""}`}
            aria-pressed={volume === n}
            onClick={() => changeVolume(n)}
          >
            {fmtInt(n)} pontos
          </button>
        ))}
        <span className="muted" style={{ alignSelf: "center", fontSize: 13 }}>
          clicar de novo no volume ativo gera outro dataset
        </span>
      </div>

      <div className="grid-2">
        <ApexDemo data={apexData} onRenderTime={reportApex} />
        <EchartsDemo data={data} onRenderTime={reportEcharts} />
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <strong>Tempo até o primeiro paint (ms)</strong>
        <table className="charts-table">
          <thead>
            <tr>
              <th>Volume</th>
              <th>Apex (SVG)</th>
              <th>ECharts (Canvas)</th>
            </tr>
          </thead>
          <tbody>
            {VOLUMES.map((n) => (
              <tr key={n} className={volume === n ? "current" : ""}>
                <td>{fmtInt(n)}</td>
                <td className="num">{cell(n, "apex")}</td>
                <td className="num">{cell(n, "echarts")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted" style={{ margin: "6px 0 0", fontSize: 13 }}>
          "—" = o gráfico não renderizou esse volume • "medindo…" = render em andamento
        </p>
      </div>
    </section>
  );
}
