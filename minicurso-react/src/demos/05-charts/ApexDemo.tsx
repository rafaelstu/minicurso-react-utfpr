// Demo 5 · ApexCharts (SVG) — poucos pontos, dado agregado, entrega rápida:
// visual pronto de fábrica, configurado só por props. 20k pontos já pesa
// (cada ponto vira um nó SVG); com 100k nem tentamos — renderizamos no máximo
// 20k e avisamos, em vez de travar a aba. Volume alto é papo do ECharts.
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { RenderCounter } from "../../components/RenderCounter";
import { useRenderTime } from "./useRenderTime";

export const APEX_LIMIT = 20_000;

const AREA_OPTIONS: ApexOptions = {
  chart: {
    animations: { enabled: false }, // medindo tempo de render, não de animação
    fontFamily: "inherit",
  },
  colors: ["#4f46e5"],
  stroke: { curve: "straight", width: 2 },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.04, stops: [0, 92, 100] },
  },
  dataLabels: { enabled: false },
  grid: { borderColor: "#e2e8f0", strokeDashArray: 4, padding: { left: 12, right: 12 } },
  xaxis: {
    type: "category",
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  yaxis: { labels: { formatter: (v: number) => `R$ ${Math.round(v / 1000)}k` } },
  markers: { size: 0 },
};

const DONUT_SERIES = [44, 27, 18, 11];
const DONUT_OPTIONS: ApexOptions = {
  chart: { animations: { enabled: false }, fontFamily: "inherit" },
  labels: ["Direto", "Marketplace", "Parceiros", "Inside sales"],
  colors: ["#4f46e5", "#0ea5e9", "#f59e0b", "#10b981"],
  legend: { position: "bottom" },
  dataLabels: { enabled: false },
  stroke: { width: 0 },
  plotOptions: {
    pie: {
      donut: {
        size: "72%",
        labels: {
          show: true,
          total: { show: true, label: "Vendas", formatter: () => "100%" },
        },
      },
    },
  },
};

type ApexDemoProps = {
  data: number[];
  onRenderTime: (ms: number) => void;
};

export function ApexDemo({ data, onRenderTime }: ApexDemoProps) {
  const capped = data.length > APEX_LIMIT;
  const rendered = useMemo(
    () => (capped ? data.slice(0, APEX_LIMIT) : data),
    [capped, data],
  );

  // Sem cap: mede o dataset inteiro. Com cap: não há número honesto para a tabela.
  useRenderTime(rendered, onRenderTime, !capped);

  const series = useMemo(() => [{ name: "MRR", data: rendered }], [rendered]);

  return (
    <div className="card">
      <div className="chart-panel-head">
        <strong>ApexCharts (SVG)</strong>
        <RenderCounter label="renders" />
        <span className="badge">área + donut</span>
      </div>
      <p className="muted" style={{ marginBottom: 4 }}>
        Área com gradiente (MRR) e donut de vendas por canal, direto por props. Passe o mouse
        com 20k pontos e veja o SVG sofrer.
      </p>

      {capped && (
        <div className="chart-warn">
          Apex (SVG) não aguenta {data.length.toLocaleString("pt-BR")} pontos — limitado a{" "}
          {APEX_LIMIT.toLocaleString("pt-BR")}; veja o ECharts. Por isso o "—" na tabela.
        </div>
      )}

      <ReactApexChart type="area" height={240} options={AREA_OPTIONS} series={series} />
      <ReactApexChart type="donut" height={230} options={DONUT_OPTIONS} series={DONUT_SERIES} />
    </div>
  );
}
