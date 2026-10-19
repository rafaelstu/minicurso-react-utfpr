// BOM — useMutation: criar post (POST /posts) + curtir com atualização otimista.
// O jsonplaceholder ACEITA o POST mas não persiste: a lista volta igual, e o
// objetivo é ver o refetch/invalidação acontecendo. O like faz PATCH de verdade
// (aparece no contador de requisições) contra um contador fake em memória, para
// o rollback do switch "forçar falha" ficar visível.
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RenderCounter } from "../../components/RenderCounter";
import { RequestCounter } from "./RequestCounter";
import { api, artificialDelay, createPost, getPosts } from "./api";

// "Servidor" fake de likes: sobrevive enquanto a página estiver aberta.
let likesOnServer = 0;
const getLikes = async () => {
  await artificialDelay();
  return likesOnServer;
};
// O PATCH passa pelo axios (contador + atraso do interceptor). Com "forçar
// falha", a chamada sai de verdade e o erro estoura depois — como um 500.
const sendLike = async (fail: boolean) => {
  await api.patch("/posts/1", { likes: likesOnServer + 1 });
  if (fail) throw new Error("500 simulado pelo switch 'forçar falha'");
  likesOnServer += 1;
  return likesOnServer;
};

export function MutationDemo() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fail, setFail] = useState(false);

  // Criar post: isPending / isSuccess / isError + invalidação da lista.
  const create = useMutation({
    mutationFn: () => createPost({ title, body }),
    onSuccess: () => {
      setTitle("");
      setBody("");
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const postsQ = useQuery({ queryKey: ["posts"], queryFn: getPosts });
  const likesQ = useQuery({ queryKey: ["likes"], queryFn: getLikes });

  // Curtir com atualização otimista: mexe no cache ANTES da resposta.
  const like = useMutation({
    mutationFn: () => sendLike(fail),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["likes"] });
      const prev = qc.getQueryData<number>(["likes"]) ?? 0;
      qc.setQueryData<number>(["likes"], prev + 1); // otimista
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      qc.setQueryData<number>(["likes"], ctx?.prev ?? 0); // rollback
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["likes"] }); // sincroniza c/ o servidor
    },
  });

  return (
    <div className="card">
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <strong>Mutações: criar post + curtir otimista</strong>
        <RenderCounter label="renders" />
        <RequestCounter />
      </div>

      <div className="grid-2">
        <div className="card">
          <strong>Criar post (POST /posts)</strong>
          <p className="muted">
            A API não persiste: o post ganha id 101 na resposta, mas a lista volta igual.
            O que queremos ver é o <code>refetch</code> da lista disparado pela invalidação.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            <input
              className="heavy-field"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="heavy-field"
              placeholder="Conteúdo"
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-good"
              disabled={create.isPending || (!title.trim() && !body.trim())}
              onClick={() => create.mutate()}
            >
              {create.isPending ? "enviando…" : "Publicar"}
            </button>
          </div>
          {create.isSuccess && (
            <p className="muted">
              criado! id {create.data.id} — repare no "atualizando em 2º plano" da lista abaixo
              (invalidação → refetch).
            </p>
          )}
          {create.isError && <p className="err">{String(create.error)}</p>}
        </div>

        <div className="card">
          <strong>Curtir com otimista + rollback</strong>
          <p className="muted">
            <code>onMutate</code> incrementa o cache na hora; <code>onError</code> desfaz;{" "}
            <code>onSettled</code> invalida. O <code>PATCH</code> é real — veja o contador de
            requisições subir. Ligue "forçar falha" e clique duas vezes: primeiro sobe e volta
            (rollback), depois sobe de verdade.
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
            <span className="badge">likes: {likesQ.data ?? 0}</span>
            <button
              type="button"
              className="btn btn-good"
              disabled={like.isPending}
              onClick={() => like.mutate()}
            >
              {like.isPending ? "curtindo…" : "Curtir (otimista)"}
            </button>
            <label className="muted" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
              <input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} />
              forçar falha
            </label>
          </div>
          {like.isError && <p className="err">deu erro → cache voltou ao valor anterior (rollback)</p>}
        </div>
      </div>

      <p className="muted" style={{ marginTop: 12 }}>
        Lista de posts {postsQ.isFetching ? <span className="badge">atualizando em 2º plano…</span> : null}
      </p>
      {/* Últimos 5: o post novo (id 101) apareceria aqui — mas a API não persiste. */}
      <div className="scroll-list" style={{ maxHeight: 160 }}>
        {postsQ.data?.slice(-5).map((p) => (
          <div key={p.id} className="list-item" style={{ cursor: "default" }}>
            <strong>#{p.id}</strong> {p.title.slice(0, 40)}…
          </div>
        ))}
      </div>
    </div>
  );
}
