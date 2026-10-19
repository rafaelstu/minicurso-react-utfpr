// BOM — TanStack Query: cache por queryKey, sem race e com refetch em segundo plano.
// A MESMA tela da versão ruim, mas com useQuery no lugar de useState + useEffect.
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RenderCounter } from "../../components/RenderCounter";
import { DelayToggle } from "./DelayToggle";
import { RequestCounter } from "./RequestCounter";
import { getComments, getPost, getPosts } from "./api";

const STALE_OPTIONS = [
  { label: "0s (sempre refaz)", value: 0 },
  { label: "5s", value: 5 },
  { label: "30s", value: 30 },
  { label: "60s", value: 60 },
];

export function UseQueryGood() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [staleSeconds, setStaleSeconds] = useState(0);
  const [focusRefetch, setFocusRefetch] = useState(true);
  const staleTime = staleSeconds * 1000;

  const postsQ = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    staleTime,
    refetchOnWindowFocus: focusRefetch,
  });

  const postQ = useQuery({
    queryKey: ["post", selectedId],
    queryFn: () => getPost(selectedId as number),
    enabled: selectedId != null,
    staleTime,
    refetchOnWindowFocus: focusRefetch,
  });

  const commentsQ = useQuery({
    queryKey: ["comments", selectedId],
    queryFn: () => getComments(selectedId as number),
    enabled: selectedId != null,
    staleTime,
    refetchOnWindowFocus: focusRefetch,
  });

  const fmt = (ms: number) => (ms ? new Date(ms).toLocaleTimeString() : "—");

  return (
    <div className="card">
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <strong>TanStack Query (bom)</strong>
        <RenderCounter label="renders" />
        <RequestCounter />
        <DelayToggle />
      </div>
      <p className="muted">
        Cada post tem seu <code>queryKey</code> — clique rápido à vontade, não existe race condition.
        Troque de aba e volte: os dados aparecem do cache na hora. Desfoque e foque a janela para
        ver o refetch automático.
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
        <label className="muted">
          staleTime:{" "}
          <select
            className="heavy-field"
            style={{ width: 160 }}
            value={staleSeconds}
            onChange={(e) => setStaleSeconds(Number(e.target.value))}
          >
            {STALE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className="muted" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={focusRefetch}
            onChange={(e) => setFocusRefetch(e.target.checked)}
          />
          refetch ao focar a janela
        </label>
        <span className="muted">atualizado às {fmt(postsQ.dataUpdatedAt)}</span>
      </div>

      <div className="split">
        <div>
          <strong className="muted">
            Posts {postsQ.isPending ? "carregando…" : `(${postsQ.data?.length ?? 0})`}
            {postsQ.isFetching && <span className="badge"> atualizando em 2º plano…</span>}
            {postsQ.isError && <span className="err"> {String(postsQ.error)}</span>}
          </strong>
          <div className="scroll-list">
            {postsQ.data?.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`list-item ${selectedId === p.id ? "active" : ""}`}
                onClick={() => setSelectedId(p.id)}
              >
                <strong>#{p.id}</strong> {p.title.slice(0, 28)}…
              </button>
            ))}
          </div>
        </div>

        <div>
          {selectedId == null && <p className="muted">Clique em um post para ver os detalhes.</p>}
          {postQ.isPending && selectedId != null && <p className="muted">carregando post {selectedId}…</p>}
          {postQ.isError && <p className="err">{String(postQ.error)}</p>}
          {postQ.data && (
            <>
              <strong>{postQ.data.title}</strong>
              <p className="muted">{postQ.data.body}</p>
              <p className="muted">
                {commentsQ.data?.length ?? 0} comentário(s)
                {postQ.isFetching && <span className="badge"> atualizando…</span>}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
