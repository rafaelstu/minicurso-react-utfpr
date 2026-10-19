// BOM (mercado) — RHF + Controller p/ componentes controlados (Select/Checkbox do shadcn)
// + register onde faz sentido + zodResolver + watch cirúrgico.
// Na lib real, os <select> abaixo seriam Select/Checkbox/Switch do shadcn; a lógica é a mesma.
import { useRef, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import type { Control, Path, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeavyField } from "../../components/HeavyField";
import { RenderCounter } from "../../components/RenderCounter";
import { employeeSchema, calcAge, type Employee } from "./schema";
import { correctEmployee, incorrectEmployee, type DemoDependent, type DemoValue, type DemoValues } from "./demoData";
import { typeFill } from "./typing";

// Re-render cirúrgico: só este componente reage à data de nascimento.
function AgePreview({ control }: { control: Control<Employee> }) {
  const birth = useWatch({ control, name: "birthDate" });
  const age = calcAge(birth ?? "");
  return (
    <span className="muted" style={{ marginLeft: 8 }}>
      <RenderCounter label="idade" /> idade calculada: {age === null ? "—" : `${age} anos`}
    </span>
  );
}

export function FormRhfController() {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<Employee>({
    // Cast necessário: Zod v4 marca opcionais/defaults de um jeito que o
    // tipo do resolver diverge do Employee. Em runtime funciona igual.
    resolver: zodResolver(employeeSchema) as unknown as Resolver<Employee>,
    defaultValues: { nationality: "Brasileira", dependents: [], accept: false } as unknown as Employee,
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

  const sel = (name: "gender" | "maritalStatus" | "contractType" | "workMode" | "accountType", label: string, opts: string[]) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <select className="heavy-field" aria-label={label} value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref}>
          <option value="">{label}…</option>
          {opts.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
    />
  );

  return (
    <form className="card" onSubmit={handleSubmit(onValid, onInvalid)}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <strong>RHF + Controller + Zod (mercado)</strong>
        <RenderCounter label="renders do form" />
        <button type="button" className="btn btn-bad" onClick={() => startFill(incorrectEmployee)}>Digitar rápido (incorreto)</button>
        <button type="button" className="btn btn-good" onClick={() => startFill(correctEmployee)}>Digitar rápido (correto)</button>
      </div>
      <p className="muted">
        Controlados (selects/checkbox) via <code>Controller</code>; resto via <code>register</code>.
        A idade abaixo usa <code>useWatch</code> isolado — só ela re-renderiza.
      </p>

      <h4>Dados pessoais <AgePreview control={control} /></h4>
      <div className="form-grid">
        <div><HeavyField placeholder="Nome completo" {...register("fullName")} /><small className="err">{errors.fullName?.message}</small></div>
        <div><HeavyField placeholder="Nome social (opcional)" {...register("socialName")} /></div>
        <div><HeavyField type="date" aria-label="Nascimento" {...register("birthDate")} /><small className="err">{errors.birthDate?.message}</small></div>
        <div><HeavyField placeholder="CPF" {...register("cpf")} /><small className="err">{errors.cpf?.message}</small></div>
        <div><HeavyField placeholder="RG" {...register("rg")} /><small className="err">{errors.rg?.message}</small></div>
        <div>{sel("gender", "Sexo", ["Masculino", "Feminino", "Outro", "Prefiro não informar"])}</div>
        <div>{sel("maritalStatus", "Estado civil", ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"])}</div>
        <div><HeavyField placeholder="Nacionalidade" {...register("nationality")} /></div>
        <div><HeavyField placeholder="Nome da mãe" {...register("motherName")} /><small className="err">{errors.motherName?.message}</small></div>
        <div><HeavyField placeholder="Nome do pai (opcional)" {...register("fatherName")} /></div>
      </div>

      <h4>Contato <RenderCounter label="seção" /></h4>
      <div className="form-grid">
        <div><HeavyField placeholder="E-mail pessoal" {...register("personalEmail")} /><small className="err">{errors.personalEmail?.message}</small></div>
        <div><HeavyField placeholder="E-mail corporativo" {...register("workEmail")} /><small className="err">{errors.workEmail?.message}</small></div>
        <div><HeavyField placeholder="Telefone" {...register("phone")} /><small className="err">{errors.phone?.message}</small></div>
        <div><HeavyField placeholder="Celular" {...register("mobile")} /><small className="err">{errors.mobile?.message}</small></div>
        <div><HeavyField placeholder="Emergência: nome" {...register("emergencyName")} /></div>
        <div><HeavyField placeholder="Emergência: telefone" {...register("emergencyPhone")} /></div>
      </div>

      <h4>Endereço <RenderCounter label="seção" /></h4>
      <div className="form-grid">
        <div><HeavyField placeholder="CEP" {...register("zip")} /><small className="err">{errors.zip?.message}</small></div>
        <div><HeavyField placeholder="Rua" {...register("street")} /></div>
        <div><HeavyField placeholder="Número" {...register("number")} /></div>
        <div><HeavyField placeholder="Complemento" {...register("complement")} /></div>
        <div><HeavyField placeholder="Bairro" {...register("neighborhood")} /></div>
        <div><HeavyField placeholder="Cidade" {...register("city")} /></div>
        <div><HeavyField placeholder="UF" {...register("state")} /><small className="err">{errors.state?.message}</small></div>
      </div>

      <h4>Profissional <RenderCounter label="seção" /></h4>
      <div className="form-grid">
        <div><HeavyField placeholder="Cargo" {...register("role")} /></div>
        <div><HeavyField placeholder="Departamento" {...register("department")} /></div>
        <div><HeavyField placeholder="Salário" {...register("salary")} /><small className="err">{errors.salary?.message}</small></div>
        <div><HeavyField type="date" aria-label="Admissão" {...register("hireDate")} /></div>
        <div>{sel("contractType", "Contrato", ["CLT", "PJ", "Estágio", "Aprendiz"])}</div>
        <div>{sel("workMode", "Regime", ["Presencial", "Híbrido", "Remoto"])}</div>
        <div><HeavyField placeholder="Gestor" {...register("manager")} /></div>
      </div>

      <h4>Bancários <RenderCounter label="seção" /></h4>
      <div className="form-grid">
        <div><HeavyField placeholder="Banco" {...register("bank")} /></div>
        <div><HeavyField placeholder="Agência" {...register("agency")} /></div>
        <div><HeavyField placeholder="Conta" {...register("account")} /></div>
        <div>{sel("accountType", "Tipo de conta", ["Corrente", "Poupança", "Salário"])}</div>
      </div>

      <h4>Dependentes ({fields.length})</h4>
      {fields.map((f, i) => (
        <div key={f.id} className="card" style={{ marginBottom: 8 }}>
          <div className="form-grid">
            <HeavyField placeholder="Nome" {...register(`dependents.${i}.name` as const)} />
            <Controller
              name={`dependents.${i}.kinship` as const}
              control={control}
              render={({ field }) => (
                <select className="heavy-field" value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref}>
                  <option value="">Parentesco…</option><option>Filho(a)</option><option>Cônjuge</option><option>Enteado(a)</option><option>Outro</option>
                </select>
              )}
            />
            <HeavyField type="date" aria-label="Nascimento" {...register(`dependents.${i}.birthDate` as const)} />
            <button type="button" className="btn" onClick={() => remove(i)}>Remover</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => append({ name: "", kinship: "", birthDate: "" })}>+ Adicionar dependente</button>

      <h4>Acesso</h4>
      <Controller
        name="accept"
        control={control}
        render={({ field }) => (
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} onBlur={field.onBlur} ref={field.ref} />
            Li e aceito os termos
          </label>
        )}
      />
      <small className="err">{errors.accept?.message}</small>
      <div className="form-grid" style={{ marginTop: 8 }}>
        <div><HeavyField type="password" placeholder="Senha" {...register("password")} /><small className="err">{errors.password?.message}</small></div>
        <div><HeavyField type="password" placeholder="Confirmar senha" {...register("confirmPassword")} /><small className="err">{errors.confirmPassword?.message}</small></div>
      </div>

      <button type="submit" className="btn btn-good" style={{ marginTop: 12 }}>Validar cadastro</button>
      {ok && <p style={{ color: "#15803d", fontWeight: 700 }}>{ok}</p>}
    </form>
  );
}
