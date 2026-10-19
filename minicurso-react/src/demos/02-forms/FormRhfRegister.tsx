// BOM — mesmo formulário com React Hook Form + register (não controlado).
// O form NÃO re-renderiza ao digitar: o contador geral fica parado.
// Dependentes com useFieldArray. Validação com o mesmo schema Zod.
import { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { Path, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeavyField } from "../../components/HeavyField";
import { RenderCounter } from "../../components/RenderCounter";
import { employeeSchema, type Employee } from "./schema";
import { correctEmployee, incorrectEmployee, type DemoDependent, type DemoValue, type DemoValues } from "./demoData";
import { typeFill } from "./typing";

export function FormRhfRegister() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Employee>({
    // Cast necessário: Zod v4 marca opcionais/defaults de um jeito que o
    // tipo do resolver diverge do Employee. Em runtime funciona igual.
    resolver: zodResolver(employeeSchema) as unknown as Resolver<Employee>,
    defaultValues: {
      nationality: "Brasileira",
      dependents: [],
      accept: false,
    } as unknown as Employee,
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: "dependents" });

  const [ok, setOk] = useState("");
  const stopFill = useRef<(() => void) | null>(null);

  const onValid = (data: Employee) => {
    setOk(`Cadastro válido! ${data.fullName} (${data.dependents.length} dependente(s)).`);
  };
  const onInvalid = () => setOk("");

  function applyValue(field: string, value: DemoValue) {
    if (field === "dependents") replace(value as DemoDependent[]);
    else setValue(field as Path<Employee>, value as never, { shouldDirty: true });
  }

  // BOM: RHF guarda os valores fora do React e o submit lê o estado atual —
  // sem closure velho, sem efeito extra para o submit automático.
  function startFill(values: DemoValues) {
    stopFill.current?.();
    stopFill.current = typeFill(values, applyValue, () => void handleSubmit(onValid, onInvalid)());
  }

  const err = (name: keyof Employee) => errors[name]?.message as string | undefined;

  return (
    <form
      className="card"
      onSubmit={handleSubmit(onValid, onInvalid)}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <strong>RHF + register (bom) — sem re-render ao digitar</strong>
        <RenderCounter label="renders do form" />
        <button type="button" className="btn btn-bad" onClick={() => startFill(incorrectEmployee)}>Digitar rápido (incorreto)</button>
        <button type="button" className="btn btn-good" onClick={() => startFill(correctEmployee)}>Digitar rápido (correto)</button>
      </div>
      <p className="muted">
        Preenchimento automático + validação no final, com o mesmo schema nas duas versões.
        Digite: o contador geral NÃO sobe — inputs não controlados, o submit lê o DOM.
      </p>

      <h4>Dados pessoais <RenderCounter label="seção" /></h4>
      <div className="form-grid">
        <div><HeavyField placeholder="Nome completo" {...register("fullName")} /><small className="err">{err("fullName")}</small></div>
        <div><HeavyField placeholder="Nome social (opcional)" {...register("socialName")} /></div>
        <div><HeavyField type="date" aria-label="Nascimento" {...register("birthDate")} /><small className="err">{err("birthDate")}</small></div>
        <div><HeavyField placeholder="CPF" {...register("cpf")} /><small className="err">{err("cpf")}</small></div>
        <div><HeavyField placeholder="RG" {...register("rg")} /><small className="err">{err("rg")}</small></div>
        <div><select className="heavy-field" {...register("gender")}><option value="">Sexo…</option><option>Masculino</option><option>Feminino</option><option>Outro</option><option>Prefiro não informar</option></select></div>
        <div><select className="heavy-field" {...register("maritalStatus")}><option value="">Estado civil…</option><option>Solteiro(a)</option><option>Casado(a)</option><option>Divorciado(a)</option><option>Viúvo(a)</option></select></div>
        <div><HeavyField placeholder="Nacionalidade" {...register("nationality")} /></div>
        <div><HeavyField placeholder="Nome da mãe" {...register("motherName")} /><small className="err">{err("motherName")}</small></div>
        <div><HeavyField placeholder="Nome do pai (opcional)" {...register("fatherName")} /></div>
      </div>

      <h4>Contato <RenderCounter label="seção" /></h4>
      <div className="form-grid">
        <div><HeavyField placeholder="E-mail pessoal" {...register("personalEmail")} /><small className="err">{err("personalEmail")}</small></div>
        <div><HeavyField placeholder="E-mail corporativo" {...register("workEmail")} /><small className="err">{err("workEmail")}</small></div>
        <div><HeavyField placeholder="Telefone" {...register("phone")} /><small className="err">{err("phone")}</small></div>
        <div><HeavyField placeholder="Celular" {...register("mobile")} /><small className="err">{err("mobile")}</small></div>
        <div><HeavyField placeholder="Emergência: nome" {...register("emergencyName")} /></div>
        <div><HeavyField placeholder="Emergência: telefone" {...register("emergencyPhone")} /></div>
      </div>

      <h4>Endereço <RenderCounter label="seção" /></h4>
      <div className="form-grid">
        <div><HeavyField placeholder="CEP" {...register("zip")} /><small className="err">{err("zip")}</small></div>
        <div><HeavyField placeholder="Rua" {...register("street")} /></div>
        <div><HeavyField placeholder="Número" {...register("number")} /></div>
        <div><HeavyField placeholder="Complemento" {...register("complement")} /></div>
        <div><HeavyField placeholder="Bairro" {...register("neighborhood")} /></div>
        <div><HeavyField placeholder="Cidade" {...register("city")} /></div>
        <div><HeavyField placeholder="UF" {...register("state")} /><small className="err">{err("state")}</small></div>
      </div>

      <h4>Profissional <RenderCounter label="seção" /></h4>
      <div className="form-grid">
        <div><HeavyField placeholder="Cargo" {...register("role")} /></div>
        <div><HeavyField placeholder="Departamento" {...register("department")} /></div>
        <div><HeavyField placeholder="Salário" {...register("salary")} /><small className="err">{err("salary")}</small></div>
        <div><HeavyField type="date" aria-label="Admissão" {...register("hireDate")} /></div>
        <div><select className="heavy-field" {...register("contractType")}><option value="">Contrato…</option><option>CLT</option><option>PJ</option><option>Estágio</option><option>Aprendiz</option></select></div>
        <div><select className="heavy-field" {...register("workMode")}><option value="">Regime…</option><option>Presencial</option><option>Híbrido</option><option>Remoto</option></select></div>
        <div><HeavyField placeholder="Gestor" {...register("manager")} /></div>
      </div>

      <h4>Bancários <RenderCounter label="seção" /></h4>
      <div className="form-grid">
        <div><HeavyField placeholder="Banco" {...register("bank")} /></div>
        <div><HeavyField placeholder="Agência" {...register("agency")} /></div>
        <div><HeavyField placeholder="Conta" {...register("account")} /></div>
        <div><select className="heavy-field" {...register("accountType")}><option value="">Tipo…</option><option>Corrente</option><option>Poupança</option><option>Salário</option></select></div>
      </div>

      <h4>Dependentes ({fields.length})</h4>
      {fields.map((f, i) => (
        <div key={f.id} className="card" style={{ marginBottom: 8 }}>
          <div className="form-grid">
            <HeavyField placeholder="Nome" {...register(`dependents.${i}.name` as const)} />
            <select className="heavy-field" {...register(`dependents.${i}.kinship` as const)}>
              <option value="">Parentesco…</option><option>Filho(a)</option><option>Cônjuge</option><option>Enteado(a)</option><option>Outro</option>
            </select>
            <HeavyField type="date" aria-label="Nascimento" {...register(`dependents.${i}.birthDate` as const)} />
            <button type="button" className="btn" onClick={() => remove(i)}>Remover</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => append({ name: "", kinship: "", birthDate: "" })}>
        + Adicionar dependente
      </button>

      <h4>Acesso</h4>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" {...register("accept")} /> Li e aceito os termos
      </label>
      <small className="err">{errors.accept?.message}</small>
      <div className="form-grid" style={{ marginTop: 8 }}>
        <div><HeavyField type="password" placeholder="Senha" {...register("password")} /><small className="err">{err("password")}</small></div>
        <div><HeavyField type="password" placeholder="Confirmar senha" {...register("confirmPassword")} /><small className="err">{err("confirmPassword")}</small></div>
      </div>

      <button type="submit" className="btn btn-good" style={{ marginTop: 12 }}>Validar cadastro</button>
      {ok && <p style={{ color: "#15803d", fontWeight: 700 }}>{ok}</p>}
    </form>
  );
}
