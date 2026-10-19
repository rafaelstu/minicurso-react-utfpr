import { useState } from "react";
import { RenderCounter } from "../../components/RenderCounter";
import { ContextBad } from "./ContextBad";
import { ZustandGood } from "./ZustandGood";

export function StateDemo() {
  const [tab, setTab] = useState<"context" | "zustand">("context");

  return (
    <section>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>3. Estado: Context × Zustand</h2>
        <RenderCounter label="renders da aba" />
      </div>
      <p className="muted">
        Estado global com <code>theme</code>, <code>user</code> e <code>ticker</code> (16ms).
        A maioria só lê <code>theme</code>; poucos leem <code>ticker</code>. Mesmos controles nos dois.
      </p>

      <div className="tabs" role="tablist" aria-label="Versões de estado">
        <button role="tab" aria-selected={tab === "context"} className={`tab ${tab === "context" ? "active" : ""}`} onClick={() => setTab("context")}>
          Context (ruim)
        </button>
        <button role="tab" aria-selected={tab === "zustand"} className={`tab ${tab === "zustand" ? "active" : ""}`} onClick={() => setTab("zustand")}>
          Zustand (bom)
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        {tab === "context" ? <ContextBad /> : <ZustandGood />}
      </div>

      <p className="muted" style={{ marginTop: 12 }}>
        Resumo: Zustand para estado de UI. Dado de API vai para o TanStack Query.
      </p>
    </section>
  );
}
