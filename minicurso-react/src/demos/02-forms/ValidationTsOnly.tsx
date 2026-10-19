// RUIM — a ilusão do TypeScript: ele some no navegador e não valida nada em runtime.
import { useState } from "react";
import { RenderCounter } from "../../components/RenderCounter";

// Interface manual duplicada (o que o Zod evita com z.infer).
interface Employee {
  fullName: string;
  age: number;
  salary: number;
  city: string;
}

export function ValidationTsOnly() {
  const [salaryOut, setSalaryOut] = useState("—");
  const [apiOut, setApiOut] = useState("—");

  function cenarioSalario() {
    // O input sempre entrega string. O "as number" cala o TS mas não converte nada.
    const digitado = "abc";
    const salary = digitado as unknown as number;
    const emp: Employee = { fullName: "Ana", age: 30, salary, city: "Curitiba" };
    // Soma quebra em runtime: "abc" não é número, vira NaN na folha.
    const bonus = (emp.salary as unknown as string) + 500;
    const total = Number(emp.salary) + 500;
    setSalaryOut(
      `digitado="${digitado}" → salary=${String(emp.salary)} (TS jura que é number) → "salário"+500="${bonus}" → total numérico=${total} (NaN)`,
    );
  }

  function cenarioApi() {
    // Payload real vindo da rede, com campo faltando.
    const json = '{"fullName":"Beto"}';
    try {
      const emp = JSON.parse(json) as Employee; // compila, sem erro
      // Estoura em runtime: age e city são undefined.
      const resumo = `${emp.fullName} tem ${emp.age.toFixed(0)} anos em ${emp.city.toUpperCase()}`;
      setApiOut(resumo);
    } catch (e) {
      setApiOut(`ESTOUROU em runtime: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return (
    <div className="card">
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong>Só TypeScript (sem validação)</strong>
        <RenderCounter label="renders" />
      </div>
      <p className="muted">Interface não impede dado inválido. Clique e veja o erro silencioso / crash.</p>
      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <button type="button" className="btn" onClick={cenarioSalario}>
          1. Digitar “abc” no salário
        </button>
        <button type="button" className="btn" onClick={cenarioApi}>
          2. Resposta da API incompleta
        </button>
      </div>
      <p className="muted" style={{ marginTop: 8 }}>Salário: <code>{salaryOut}</code></p>
      <p className="muted">API: <code>{apiOut}</code></p>
    </div>
  );
}
