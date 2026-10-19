import { useState } from "react";
import { RenderCounter } from "../../components/RenderCounter";
import { FormBadUseState } from "./FormBadUseState";
import { FormRhfRegister } from "./FormRhfRegister";
import { FormRhfController } from "./FormRhfController";
import { ValidationTsOnly } from "./ValidationTsOnly";
import { ValidationZod } from "./ValidationZod";

type Tab = "ruim" | "register" | "controller";

export function FormsDemo() {
  const [tab, setTab] = useState<Tab>("ruim");

  return (
    <section>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>2. Formulários: useState × RHF × Zod</h2>
        <RenderCounter label="renders da aba" />
      </div>
      <p className="muted">
        Cadastro de colaborador (RH), ~40 campos. Mesmo <code>HeavyField</code> nas 3 versões.
        “Digitar rápido (incorreto)” e “(correto)” preenchem tudo campo a campo e validam no final —
        observe o contador geral e o FPS enquanto isso.
      </p>

      <div className="tabs" role="tablist" aria-label="Versões do formulário">
        <button role="tab" aria-selected={tab === "ruim"} className={`tab ${tab === "ruim" ? "active" : ""}`} onClick={() => setTab("ruim")}>
          useState (ruim)
        </button>
        <button role="tab" aria-selected={tab === "register"} className={`tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>
          RHF register
        </button>
        <button role="tab" aria-selected={tab === "controller"} className={`tab ${tab === "controller" ? "active" : ""}`} onClick={() => setTab("controller")}>
          RHF + Controller
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        {tab === "ruim" && <FormBadUseState />}
        {tab === "register" && <FormRhfRegister />}
        {tab === "controller" && <FormRhfController />}
      </div>

      <h3 style={{ marginTop: 24 }}>Validação: só TypeScript × Zod</h3>
      <p className="muted">A ilusão do TS (some no navegador) contra o schema em runtime.</p>
      <div className="grid-2">
        <ValidationTsOnly />
        <ValidationZod />
      </div>
    </section>
  );
}
