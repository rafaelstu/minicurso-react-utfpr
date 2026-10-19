// BOM — os mesmos cenários passando pelo Zod: erro legível em vez de crash.
// O tipo Employee vem de z.infer, sem interface manual.
import { useState } from "react";
import { RenderCounter } from "../../components/RenderCounter";
import { employeeSchema, type Employee } from "./schema";

// Prova de que o tipo existe sem duplicar: essa função só compila se Employee vier do schema.
const exemploTipado: Employee = {
  fullName: "Ana",
  birthDate: "2000-01-01",
  cpf: "52998224725",
  rg: "1234567",
  gender: "F",
  maritalStatus: "Solteira",
  nationality: "Brasileira",
  motherName: "Maria",
  fatherName: "",
  socialName: "",
  personalEmail: "ana@mail.com",
  workEmail: "ana@empresa.com",
  phone: "(41) 3333-3333",
  mobile: "(41) 99999-9999",
  emergencyName: "Mae",
  emergencyPhone: "(41) 98888-8888",
  zip: "80000-000",
  street: "Rua X",
  number: "10",
  complement: "",
  neighborhood: "Centro",
  city: "Curitiba",
  state: "PR",
  role: "Dev",
  department: "TI",
  salary: 5000,
  hireDate: "2024-01-01",
  contractType: "CLT",
  workMode: "Híbrido",
  manager: "Chefe",
  bank: "001",
  agency: "0001",
  account: "12345-6",
  accountType: "Corrente",
  dependents: [],
  accept: true,
  password: "123456",
  confirmPassword: "123456",
};
void exemploTipado;

export function ValidationZod() {
  const [salaryOut, setSalaryOut] = useState("—");
  const [apiOut, setApiOut] = useState("—");

  function cenarioSalario() {
    const r = employeeSchema.safeParse({ ...exemploTipado, salary: "abc" });
    if (!r.success) {
      setSalaryOut(r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" | "));
    } else {
      setSalaryOut("passou (não deveria)");
    }
  }

  function cenarioApi() {
    const r = employeeSchema.safeParse(JSON.parse('{"fullName":"Beto"}'));
    if (!r.success) {
      const first = r.error.issues.slice(0, 6).map((i) => `${i.path.join(".")}: ${i.message}`);
      setApiOut(`${r.error.issues.length} erros. Ex.: ${first.join(" | ")}`);
    } else {
      setApiOut("passou (não deveria)");
    }
  }

  return (
    <div className="card">
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong>Com Zod (runtime + tipo)</strong>
        <RenderCounter label="renders" />
      </div>
      <p className="muted">
        Mesmo input, agora com <code>safeParse</code>. Tipo via <code>z.infer</code>, sem interface duplicada.
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <button type="button" className="btn btn-good" onClick={cenarioSalario}>
          1. Validar “abc” no salário
        </button>
        <button type="button" className="btn btn-good" onClick={cenarioApi}>
          2. Validar API incompleta
        </button>
      </div>
      <p className="muted" style={{ marginTop: 8 }}>Salário: <code>{salaryOut}</code></p>
      <p className="muted">API: <code>{apiOut}</code></p>
    </div>
  );
}
