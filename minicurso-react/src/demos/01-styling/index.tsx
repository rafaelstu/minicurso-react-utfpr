import type { ReactNode } from "react";
import { RenderCounter } from "../../components/RenderCounter";
import { AntdDemo } from "./AntdDemo";
import { CodeBlock } from "./CodeBlock";
import { ShadcnDemo } from "./ShadcnDemo";
import { StyledComponentsDemo } from "./StyledComponentsDemo";
import antdCode from "./AntdDemo.tsx?raw";
import shadcnCode from "./ShadcnDemo.tsx?raw";
import styledCode from "./StyledComponentsDemo.tsx?raw";

function Column({
  title,
  tag,
  hurts,
  helps,
  code,
  fileName,
  children,
}: {
  title: string;
  tag: "RUIM" | "BOM";
  hurts: string;
  helps: string;
  code: string;
  fileName: string;
  children: ReactNode;
}) {
  const tagStyle =
    tag === "BOM"
      ? { background: "#dcfce7", color: "#15803d", borderColor: "#bbf7d0" }
      : { background: "#fee2e2", color: "#b91c1c", borderColor: "#fecaca" };

  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <strong>{title}</strong>
        <span className="badge" style={tagStyle}>
          {tag}
        </span>
      </div>
      {children}
      <ul className="muted" style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 13.5 }}>
        <li>
          <strong>Dói:</strong> {hurts}
        </li>
        <li>
          <strong>Ajuda:</strong> {helps}
        </li>
      </ul>
      <CodeBlock code={code} fileName={fileName} />
    </div>
  );
}

export function StylingDemo() {
  return (
    <section>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>1. Estilização: styled-components × Ant Design × shadcn/ui</h2>
        <RenderCounter label="renders da aba" />
      </div>
      <p className="muted">
        O mesmo card “Plano Pro” nas três abordagens. Na apresentação: DevTools → Elements,
        trave as tags <code>&lt;style&gt;</code> e as classes com hash que o styled-components e
        o antd injetam no <code>&lt;head&gt;</code> e compare com as classes utilitárias do
        Tailwind no shadcn.
      </p>

      <div className="grid-3" style={{ marginTop: 12, alignItems: "start" }}>
        <Column
          title="styled-components"
          tag="RUIM"
          hurts="CSS montado em runtime; nomes inventados (Wrapper, InnerBox…); classes com hash ilegíveis na DevTools; nada de RSC."
          helps="Prop dinâmica ($variant) é trivial e o estilo fica colado no componente."
          code={styledCode}
          fileName="StyledComponentsDemo.tsx"
        >
          <StyledComponentsDemo />
        </Column>

        <Column
          title="Ant Design"
          tag="RUIM"
          hurts="Componente fechado em node_modules: customizar = caçar .ant-* e apelar para !important, torcendo para o update não quebrar."
          helps="Pronto de fábrica e tema por tokens do ConfigProvider quando você aceita o visual dele."
          code={antdCode}
          fileName="AntdDemo.tsx"
        >
          <AntdDemo />
        </Column>

        <Column
          title="shadcn/ui"
          tag="BOM"
          hurts="O código é seu: alguém precisa manter os arquivos de src/components/ui."
          helps="Tailwind + tokens; variante nova é uma linha no button.tsx, sem !important e sem hash."
          code={shadcnCode}
          fileName="ShadcnDemo.tsx"
        >
          <ShadcnDemo />
        </Column>
      </div>
    </section>
  );
}
