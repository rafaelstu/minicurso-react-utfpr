// RUIM × BOM — o mesmo 404 (/posts/99999) nos dois clientes.
// fetch RESOLVE a Promise mesmo em erro HTTP: o dev precisa lembrar de checar res.ok.
// axios REJEITA sozinho: cai direto no catch.
import { useState } from "react";
import { RenderCounter } from "../../components/RenderCounter";
import { api } from "./api";

const URL = "https://jsonplaceholder.typicode.com/posts/99999";

type Outcome = { ok: boolean; text: string };

export function AxiosVsFetch() {
  const [fetchOut, setFetchOut] = useState<Outcome | null>(null);
  const [axiosOut, setAxiosOut] = useState<Outcome | null>(null);

  async function comFetch() {
    try {
      const res = await fetch(URL);
      // O certo seria: if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // Sem essa checagem, tudo abaixo passa como "sucesso" — a armadilha.
      const data = await res.json();
      setFetchOut({
        ok: true,
        text: `Promise resolveu (status ${res.status}) — sem checar res.ok, seguiu como SUCESSO. Corpo: ${JSON.stringify(data)}`,
      });
    } catch (e) {
      setFetchOut({ ok: false, text: `caiu no catch: ${String(e)}` });
    }
  }

  async function comAxios() {
    try {
      const res = await api.get("/posts/99999");
      setAxiosOut({ ok: true, text: `resolveu (não deveria): status ${res.status}` });
    } catch (e) {
      setAxiosOut({
        ok: false,
        text: `Promise rejeitou — caiu no catch: ${e instanceof Error ? e.message : String(e)}`,
      });
    }
  }

  return (
    <div className="card">
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong>Axios × fetch no 404</strong>
        <RenderCounter label="renders" />
      </div>
      <p className="muted">
        Mesma URL que não existe. Clique nos dois: um cliente te avisa do 404 — o outro segue como sucesso.
      </p>
      <div className="grid-2">
        <div className="card">
          <strong>fetch</strong>
          <button type="button" className="btn" style={{ marginTop: 8 }} onClick={comFetch}>
            GET /posts/99999 com fetch
          </button>
          {fetchOut ? (
            <p className={fetchOut.ok ? "alert-good" : "alert-bad"}>{fetchOut.text}</p>
          ) : (
            <p className="muted" style={{ marginTop: 8 }}>—</p>
          )}
        </div>
        <div className="card">
          <strong>axios</strong>
          <button type="button" className="btn btn-good" style={{ marginTop: 8 }} onClick={comAxios}>
            GET /posts/99999 com axios
          </button>
          {axiosOut ? (
            <p className={axiosOut.ok ? "alert-good" : "alert-bad"}>{axiosOut.text}</p>
          ) : (
            <p className="muted" style={{ marginTop: 8 }}>—</p>
          )}
        </div>
      </div>
    </div>
  );
}
