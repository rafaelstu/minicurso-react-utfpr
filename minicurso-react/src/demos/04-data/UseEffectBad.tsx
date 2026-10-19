// RUIM — dados fetchados à mão: 3 useState por requisição + useEffect, sem cache e sem cleanup.
// Clique rápido entre posts com o atraso ligado: a resposta antiga chega depois e
// sobrescreve a atual (race condition). Trocar de aba e voltar refaz tudo do zero.
import { useEffect, useRef, useState } from "react";
import { RenderCounter } from "../../components/RenderCounter";
import { DelayToggle } from "./DelayToggle";
import { RequestCounter } from "./RequestCounter";
import { getComments, getPost, getPosts, type Comment, type Post } from "./api";

export function UseEffectBad() {
  // lista de posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

  // detalhe + comentários
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  // p/ evidenciar a corrida na tela
  const [outOfOrder, setOutOfOrder] = useState(0);
  const lastClick = useRef<number | null>(null);

  useEffect(() => {
    setPostsLoading(true);
    getPosts()
      .then(setPosts)
      .catch((e: unknown) => setPostsError(e instanceof Error ? e.message : String(e)))
      .finally(() => setPostsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedId == null) return;
    setDetailLoading(true);
    setDetailError("");
    // Sem cancelamento e sem cleanup: quem responder por último manda.
    Promise.all([getPost(selectedId), getComments(selectedId)])
      .then(([p, cs]) => {
        setPost(p);
        setComments(cs);
        if (lastClick.current !== p.id) setOutOfOrder((n) => n + 1);
      })
      .catch((e: unknown) => setDetailError(e instanceof Error ? e.message : String(e)))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  function select(id: number) {
    lastClick.current = id;
    setSelectedId(id);
  }

  // Os dados na tela são de outro post? Então a corrida aconteceu.
  const stale = selectedId != null && post != null && post.id !== selectedId;

  return (
    <div className="card">
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <strong>useEffect (ruim)</strong>
        <RenderCounter label="renders" />
        <RequestCounter />
        <DelayToggle />
      </div>
      <p className="muted">
        Sem cache, sem cleanup. Clique rápido entre posts com o atraso ligado e olhe o aviso.
        Depois troque de aba e volte: tudo recarrega do zero.
      </p>

      {stale && (
        <div className="alert-bad">
          RACE CONDITION: os dados na tela são do post {post.id}, mas você clicou no {selectedId}.
          A resposta antiga chegou depois e sobrescreveu a nova. (fora de ordem: {outOfOrder})
        </div>
      )}

      <div className="split">
        <div>
          <strong className="muted">
            Posts {postsLoading ? "carregando…" : `(${posts.length})`}
            {postsError && <span className="err"> {postsError}</span>}
          </strong>
          <div className="scroll-list">
            {posts.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`list-item ${selectedId === p.id ? "active" : ""}`}
                onClick={() => select(p.id)}
              >
                <strong>#{p.id}</strong> {p.title.slice(0, 28)}…
              </button>
            ))}
          </div>
        </div>

        <div>
          {selectedId == null && <p className="muted">Clique em um post para ver os detalhes.</p>}
          {detailLoading && <p className="muted">carregando post {selectedId}…</p>}
          {detailError && <p className="err">{detailError}</p>}
          {post && !detailLoading && (
            <>
              <strong>{post.title}</strong>
              <p className="muted">{post.body}</p>
              <p className="muted">{comments.length} comentário(s) carregado(s)</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
