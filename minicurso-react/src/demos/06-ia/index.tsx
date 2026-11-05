// Tela de fechamento: IA no fluxo de trabalho.
// Sem interação de propósito — é para ler junto com a plateia e encerrar o minicurso.
import { RenderCounter } from "../../components/RenderCounter";

const PROMPT = [
  "Contexto: stack, versão, arquivo e objetivo",
  "Restrição: o que não pode mudar (API, estilo, dependência)",
  "Exemplo: um trecho no padrão que você quer",
  "Validação: build, lint e teste rodando antes do aceite",
];

const USOS = [
  "Explicar código legado que ninguém quer tocar",
  "Escrever os testes que você adiaria",
  "Refatorar com o diff na sua frente",
  "Revisar o PR antes do humano revisar",
  "Traduzir erro de build em causa raiz",
];

export function IaDemo() {
  return (
    <section>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>6. IA no trabalho: tem que usar — como copiloto</h2>
        <RenderCounter label="renders da aba" />
      </div>
      <p className="muted">
        A pergunta não é mais <strong>se</strong> usa IA, é <strong>como</strong>. Ela já paga o
        boilerplate, os testes e a leitura de código alheio; quem usa sem revisar só acelera a
        dívida. O que separa os dois jeitos é uma coisa: <strong>revisar o diff antes do merge</strong>.
      </p>

      <div className="alert-good">
        Tem que usar — e todo dia. Mas use como engenheiro: contexto na entrada, diff revisado na
        saída. Se você não sabe explicar o que a IA escreveu, aquilo ainda não é seu.
      </div>

      <div className="grid-2" style={{ marginTop: 12, alignItems: "start" }}>
        <div className="card">
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <strong>IA como oráculo</strong>
            <span className="badge" style={{ background: "#fee2e2", color: "#b91c1c" }}>
              RUIM
            </span>
          </div>
          <ul className="muted" style={{ margin: 0, paddingLeft: 18 }}>
            <li>“Conserta esse erro” sem stack, versão nem arquivo.</li>
            <li>Aceita o diff sem ler — e a IA inventa API que não existe.</li>
            <li>Cola token, segredo ou dado real no chat.</li>
            <li>Gera um arquivo de 800 linhas que ninguém entende depois.</li>
            <li>“Funcionou aqui” sem rodar build, lint ou teste.</li>
          </ul>
          <p className="muted" style={{ margin: "10px 0 0" }}>
            Resultado: a mesma dívida técnica, só que mais rápida.
          </p>
        </div>

        <div className="card">
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <strong>IA como copiloto</strong>
            <span className="badge" style={{ background: "#dcfce7", color: "#15803d" }}>
              BOM
            </span>
          </div>
          <ul className="muted" style={{ margin: 0, paddingLeft: 18 }}>
            <li>Diz a stack, a versão, o arquivo e o objetivo.</li>
            <li>Pede o plano antes do código quando a tarefa é grande.</li>
            <li>Lê o diff e pede para explicar o que ficou obscuro.</li>
            <li>Roda build, lint e testes antes de aceitar.</li>
            <li>Usa para aprender o que não sabe — e conferir o que acha que sabe.</li>
          </ul>
          <p className="muted" style={{ margin: "10px 0 0" }}>
            Resultado: entrega mais rápida sem entregar o volante.
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 12, alignItems: "start" }}>
        <div className="card">
          <strong>Prompt que funciona</strong>
          <ol className="muted" style={{ marginBottom: 0, paddingLeft: 20 }}>
            {PROMPT.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        <div className="card">
          <strong>Bom uso, na prática</strong>
          <ul className="muted" style={{ marginBottom: 0, paddingLeft: 18 }}>
            {USOS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="muted" style={{ marginTop: 12 }}>
        Este projeto foi construído com IA no loop — e cada demo passou por build, lint e teste
        antes de entrar. A regra vale para o seu código também.
      </p>
    </section>
  );
}
