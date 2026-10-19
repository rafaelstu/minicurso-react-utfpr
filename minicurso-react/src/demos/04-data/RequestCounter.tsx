// BOM — lê o contador global de requisições (observável no api.ts).
// Serve para comparar quantas chamadas cada versão dispara.
import { useSyncExternalStore } from "react";
import { reqStats, resetStats, subscribeStats } from "./api";

export function RequestCounter() {
  const count = useSyncExternalStore(subscribeStats, () => reqStats.count);

  return (
    <span className="badge" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      requisições à API: {count}
      <button
        type="button"
        className="btn"
        style={{ padding: "2px 8px", fontSize: 12 }}
        onClick={resetStats}
      >
        zerar
      </button>
    </span>
  );
}
