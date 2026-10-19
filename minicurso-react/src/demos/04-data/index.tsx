import { useState } from "react";
import { RenderCounter } from "../../components/RenderCounter";
import { AxiosVsFetch } from "./AxiosVsFetch";
import { UseEffectBad } from "./UseEffectBad";
import { UseQueryGood } from "./UseQueryGood";
import { MutationDemo } from "./MutationDemo";

type Tab = "ruim" | "bom" | "mutacao" | "axios";

const TABS: { id: Tab; label: string }[] = [
  { id: "ruim", label: "useEffect (ruim)" },
  { id: "bom", label: "TanStack Query (bom)" },
  { id: "mutacao", label: "Mutação + otimista" },
  { id: "axios", label: "Axios × fetch" },
];

export function DataDemo() {
  const [tab, setTab] = useState<Tab>("ruim");

  return (
    <section>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>4. Dados: useEffect × TanStack Query</h2>
        <RenderCounter label="renders da aba" />
      </div>
      <p className="muted">
        Lista de posts + detalhe com comentários (jsonplaceholder, sem chave; aceita POST mas não
        persiste). Mesma tela e mesma API nas duas versões — muda só quem consome.
      </p>

      <div className="tabs" role="tablist" aria-label="Versões de dados">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        {tab === "ruim" && <UseEffectBad />}
        {tab === "bom" && <UseQueryGood />}
        {tab === "mutacao" && <MutationDemo />}
        {tab === "axios" && <AxiosVsFetch />}
      </div>
    </section>
  );
}
