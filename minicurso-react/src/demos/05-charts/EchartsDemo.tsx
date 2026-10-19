// Demo 5 · ECharts (Canvas) — muito volume: 100k pontos com dataZoom (slider +
// inside) e sampling "lttb", o ECharts reduz a série ao que cabe na tela e
// desenha em Canvas. Em troca, o option é mais verboso e o visual não vem pronto.
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption, LineSeriesOption } from "echarts";
import { RenderCounter } from "../../components/RenderCounter";
import { useRenderTime } from "./useRenderTime";

// `large` não é declarado no tipo de série de linha do ECharts 6 (a flag existe
// no runtime para scatter/bar) — o downsample de verdade aqui é o sampling: "lttb".
type LineWithLarge = LineSeriesOption & { large?: boolean };

type EchartsDemoProps = {
  data: number[];
  onRenderTime: (ms: number) => void;
};

export function EchartsDemo({ data, onRenderTime }: EchartsDemoProps) {
  useRenderTime(data, onRenderTime);

  const option = useMemo<EChartsOption>(
    () => ({
      animation: false, // tempo de render, não de animação
      grid: { left: 64, right: 20, top: 28, bottom: 72 },
      tooltip: {
        trigger: "axis",
        valueFormatter: (value) => `R$ ${Number(value).toLocaleString("pt-BR")}`,
      },
      xAxis: { type: "category", boundaryGap: false },
      yAxis: {
        type: "value",
        scale: true,
        axisLabel: { formatter: (v: number) => `R$ ${Math.round(v / 1000)}k` },
      },
      dataZoom: [
        { type: "inside", start: 0, end: 100 },
        { type: "slider", start: 0, end: 100, height: 22, bottom: 14 },
      ],
      series: [
        {
          name: "MRR",
          type: "line",
          data,
          showSymbol: false,
          large: true,
          sampling: "lttb",
          lineStyle: { width: 1.2, color: "#0ea5e9" },
          areaStyle: { opacity: 0.07, color: "#0ea5e9" },
        } as LineWithLarge,
      ],
    }),
    [data],
  );

  return (
    <div className="card">
      <div className="chart-panel-head">
        <strong>ECharts (Canvas)</strong>
        <RenderCounter label="renders" />
        <span className="badge">dataZoom + sampling</span>
      </div>
      <p className="muted" style={{ marginBottom: 4 }}>
        O mesmo dataset, agora em Canvas: role o mouse para dar zoom, arraste o slider e passe
        o mouse nos 100k pontos. O FPS continua de pé.
      </p>
      <ReactECharts
        option={option}
        opts={{ renderer: "canvas" }}
        style={{ height: 500, width: "100%" }}
      />
    </div>
  );
}
