// RUIM — o horror clássico: um useState por campo, validação com ifs e regex no submit.
// Funciona, mas cada tecla re-renderiza o formulário INTEIRO (veja os contadores).
// De propósito: componente único gigante, lógica duplicada, sem schema.
import { useEffect, useRef, useState } from "react";
import { HeavyField } from "../../components/HeavyField";
import { RenderCounter } from "../../components/RenderCounter";
import { correctEmployee, incorrectEmployee, type DemoValue, type DemoValues } from "./demoData";
import { typeFill } from "./typing";

type Dep = { name: string; kinship: string; birthDate: string };

export function FormBadUseState() {
  // — Dados pessoais (10 useState) —
  const [fullName, setFullName] = useState("");
  const [socialName, setSocialName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [nationality, setNationality] = useState("Brasileira");
  const [motherName, setMotherName] = useState("");
  const [fatherName, setFatherName] = useState("");
  // — Contato (6) —
  const [personalEmail, setPersonalEmail] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  // — Endereço (7) —
  const [zip, setZip] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  // — Profissional (7) —
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [contractType, setContractType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [manager, setManager] = useState("");
  // — Bancários (4) —
  const [bank, setBank] = useState("");
  const [agency, setAgency] = useState("");
  const [account, setAccount] = useState("");
  const [accountType, setAccountType] = useState("");
  // — Dependentes + termos —
  const [dependents, setDependents] = useState<Dep[]>([]);
  const [accept, setAccept] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<string[]>([]);
  const [ok, setOk] = useState("");
  const stopFill = useRef<(() => void) | null>(null);
  // RUIM: o typeFill chamaria um submitNow "congelado" no clique (closure velho).
  // Guardamos a versão mais recente num ref atualizado a cada render — trabalho
  // manual que o RHF elimina (lá o handleSubmit lê os valores atuais direto).
  const submitRef = useRef(submitNow);
  useEffect(() => {
    submitRef.current = submitNow;
  });

  // Mapa campo → setter só para o preenchimento automático (36 setters!).
  const setters: Record<string, (v: string) => void> = {
    fullName: setFullName,
    socialName: setSocialName,
    birthDate: setBirthDate,
    cpf: setCpf,
    rg: setRg,
    gender: setGender,
    maritalStatus: setMaritalStatus,
    nationality: setNationality,
    motherName: setMotherName,
    fatherName: setFatherName,
    personalEmail: setPersonalEmail,
    workEmail: setWorkEmail,
    phone: setPhone,
    mobile: setMobile,
    emergencyName: setEmergencyName,
    emergencyPhone: setEmergencyPhone,
    zip: setZip,
    street: setStreet,
    number: setNumber,
    complement: setComplement,
    neighborhood: setNeighborhood,
    city: setCity,
    state: setState,
    role: setRole,
    department: setDepartment,
    salary: setSalary,
    hireDate: setHireDate,
    contractType: setContractType,
    workMode: setWorkMode,
    manager: setManager,
    bank: setBank,
    agency: setAgency,
    account: setAccount,
    accountType: setAccountType,
    password: setPassword,
    confirmPassword: setConfirmPassword,
  };

  function applyValue(field: string, value: DemoValue) {
    if (field === "dependents") setDependents(value as Dep[]);
    else if (field === "accept") setAccept(value as boolean);
    else setters[field](value as string);
  }

  function validarCpf(cpfV: string): boolean {
    const d = cpfV.replace(/\D/g, "");
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
    let s1 = 0;
    for (let i = 0; i < 9; i++) s1 += Number(d[i]) * (10 - i);
    let r1 = (s1 * 10) % 11;
    if (r1 === 10) r1 = 0;
    if (r1 !== Number(d[9])) return false;
    let s2 = 0;
    for (let i = 0; i < 10; i++) s2 += Number(d[i]) * (11 - i);
    let r2 = (s2 * 10) % 11;
    if (r2 === 10) r2 = 0;
    return r2 === Number(d[10]);
  }

  function submitNow() {
    const errs: string[] = [];
    if (fullName.trim().length < 5) errs.push("Nome completo muito curto.");
    if (!birthDate) errs.push("Data de nascimento obrigatória.");
    else {
      const b = new Date(birthDate + "T00:00:00");
      const age = (Date.now() - b.getTime()) / (365.25 * 24 * 3600 * 1000);
      if (age < 16) errs.push("Precisa ter 16 anos ou mais.");
    }
    if (!validarCpf(cpf)) errs.push("CPF inválido.");
    if (rg.trim().length < 5) errs.push("RG incompleto.");
    if (!gender) errs.push("Sexo obrigatório.");
    if (!maritalStatus) errs.push("Estado civil obrigatório.");
    if (motherName.trim().length < 5) errs.push("Nome da mãe obrigatório.");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(personalEmail)) errs.push("E-mail pessoal inválido.");
    if (!emailRe.test(workEmail)) errs.push("E-mail corporativo inválido.");
    const foneRe = /^(\D*\d\D*){10,11}$/;
    if (!foneRe.test(phone)) errs.push("Telefone inválido (DDD + número).");
    if (!foneRe.test(mobile)) errs.push("Celular inválido.");
    if (emergencyName.trim().length < 3) errs.push("Contato de emergência obrigatório.");
    if (!foneRe.test(emergencyPhone)) errs.push("Telefone de emergência inválido.");
    if (!/^\d{5}-?\d{3}$/.test(zip)) errs.push("CEP no formato 00000-000.");
    if (street.trim().length < 3) errs.push("Rua obrigatória.");
    if (!number) errs.push("Número obrigatório.");
    if (neighborhood.trim().length < 2) errs.push("Bairro obrigatório.");
    if (city.trim().length < 2) errs.push("Cidade obrigatória.");
    if (state.trim().length !== 2) errs.push("UF com 2 letras.");
    if (role.trim().length < 2) errs.push("Cargo obrigatório.");
    if (department.trim().length < 2) errs.push("Departamento obrigatório.");
    const sal = Number(String(salary).replace(/[^\d,.-]/g, "").replace(",", "."));
    if (Number.isNaN(sal)) errs.push("Salário precisa ser número.");
    else if (sal < 1518) errs.push("Salário abaixo do mínimo.");
    if (!hireDate) errs.push("Data de admissão obrigatória.");
    if (!contractType) errs.push("Tipo de contrato obrigatório.");
    if (!workMode) errs.push("Regime obrigatório.");
    if (manager.trim().length < 3) errs.push("Gestor obrigatório.");
    if (bank.trim().length < 2) errs.push("Banco obrigatório.");
    if (agency.trim().length < 3) errs.push("Agência incompleta.");
    if (account.trim().length < 4) errs.push("Conta incompleta.");
    if (!accountType) errs.push("Tipo de conta obrigatório.");
    dependents.forEach((dep, i) => {
      if (dep.name.trim().length < 3) errs.push(`Dependente ${i + 1}: nome curto.`);
      if (!dep.kinship) errs.push(`Dependente ${i + 1}: parentesco.`);
      if (!dep.birthDate) errs.push(`Dependente ${i + 1}: nascimento.`);
    });
    if (!accept) errs.push("Aceite os termos.");
    if (password.length < 6) errs.push("Senha com no mínimo 6 caracteres.");
    if (password !== confirmPassword) errs.push("Senhas não conferem.");
    setErrors(errs);
    setOk(errs.length === 0 ? `Cadastro válido! ${fullName || "colaborador"} (${dependents.length} dependente(s)).` : "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitNow();
  }

  function startFill(values: DemoValues) {
    stopFill.current?.();
    stopFill.current = typeFill(values, applyValue, () => submitRef.current());
  }

  const field = { marginBottom: 8 } as const;

  return (
    <form onSubmit={handleSubmit} className="card">
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <strong>useState (ruim) — 40+ estados, tudo re-renderiza</strong>
        <RenderCounter label="renders do form" />
        <button type="button" className="btn btn-bad" onClick={() => startFill(incorrectEmployee)}>Digitar rápido (incorreto)</button>
        <button type="button" className="btn btn-good" onClick={() => startFill(correctEmployee)}>Digitar rápido (correto)</button>
      </div>
      <p className="muted">
        Os botões preenchem o formulário campo a campo (digitação simulada) e validam no final —
        um dataset viola o schema, o outro passa. Digite qualquer campo: TODOS os contadores sobem juntos.
      </p>

      <h4>Dados pessoais</h4>
      <div style={field}><RenderCounter label="nome" /><HeavyField placeholder="Nome completo" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
      <div style={field}><RenderCounter label="social" /><HeavyField placeholder="Nome social (opcional)" value={socialName} onChange={(e) => setSocialName(e.target.value)} /></div>
      <div style={field}><RenderCounter label="nasc" /><HeavyField type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} aria-label="Data de nascimento" /></div>
      <div style={field}><RenderCounter label="cpf" /><HeavyField placeholder="CPF 000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} /></div>
      <div style={field}><RenderCounter label="rg" /><HeavyField placeholder="RG" value={rg} onChange={(e) => setRg(e.target.value)} /></div>
      <div style={field}><RenderCounter label="sexo" />
        <select className="heavy-field" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Sexo…</option><option>Masculino</option><option>Feminino</option><option>Outro</option><option>Prefiro não informar</option>
        </select></div>
      <div style={field}><RenderCounter label="civil" />
        <select className="heavy-field" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
          <option value="">Estado civil…</option><option>Solteiro(a)</option><option>Casado(a)</option><option>Divorciado(a)</option><option>Viúvo(a)</option>
        </select></div>
      <div style={field}><RenderCounter label="nac" /><HeavyField placeholder="Nacionalidade" value={nationality} onChange={(e) => setNationality(e.target.value)} /></div>
      <div style={field}><RenderCounter label="mãe" /><HeavyField placeholder="Nome da mãe" value={motherName} onChange={(e) => setMotherName(e.target.value)} /></div>
      <div style={field}><RenderCounter label="pai" /><HeavyField placeholder="Nome do pai (opcional)" value={fatherName} onChange={(e) => setFatherName(e.target.value)} /></div>

      <h4>Contato</h4>
      <div style={field}><RenderCounter label="email-p" /><HeavyField placeholder="E-mail pessoal" value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} /></div>
      <div style={field}><RenderCounter label="email-c" /><HeavyField placeholder="E-mail corporativo" value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} /></div>
      <div style={field}><RenderCounter label="tel" /><HeavyField placeholder="Telefone (41) 3333-3333" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
      <div style={field}><RenderCounter label="cel" /><HeavyField placeholder="Celular (41) 99999-9999" value={mobile} onChange={(e) => setMobile(e.target.value)} /></div>
      <div style={field}><RenderCounter label="emg-n" /><HeavyField placeholder="Emergência: nome" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} /></div>
      <div style={field}><RenderCounter label="emg-t" /><HeavyField placeholder="Emergência: telefone" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} /></div>

      <h4>Endereço</h4>
      <div style={field}><RenderCounter label="cep" /><HeavyField placeholder="CEP 00000-000" value={zip} onChange={(e) => setZip(e.target.value)} /></div>
      <div style={field}><RenderCounter label="rua" /><HeavyField placeholder="Rua" value={street} onChange={(e) => setStreet(e.target.value)} /></div>
      <div style={field}><RenderCounter label="num" /><HeavyField placeholder="Número" value={number} onChange={(e) => setNumber(e.target.value)} /></div>
      <div style={field}><RenderCounter label="compl" /><HeavyField placeholder="Complemento" value={complement} onChange={(e) => setComplement(e.target.value)} /></div>
      <div style={field}><RenderCounter label="bairro" /><HeavyField placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} /></div>
      <div style={field}><RenderCounter label="cidade" /><HeavyField placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} /></div>
      <div style={field}><RenderCounter label="uf" /><HeavyField placeholder="UF (PR)" value={state} onChange={(e) => setState(e.target.value)} /></div>

      <h4>Profissional</h4>
      <div style={field}><RenderCounter label="cargo" /><HeavyField placeholder="Cargo" value={role} onChange={(e) => setRole(e.target.value)} /></div>
      <div style={field}><RenderCounter label="depto" /><HeavyField placeholder="Departamento" value={department} onChange={(e) => setDepartment(e.target.value)} /></div>
      <div style={field}><RenderCounter label="sal" /><HeavyField placeholder="Salário (ex. 5000)" value={salary} onChange={(e) => setSalary(e.target.value)} /></div>
      <div style={field}><RenderCounter label="adm" /><HeavyField type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} aria-label="Data de admissão" /></div>
      <div style={field}><RenderCounter label="contrato" />
        <select className="heavy-field" value={contractType} onChange={(e) => setContractType(e.target.value)}>
          <option value="">Tipo de contrato…</option><option>CLT</option><option>PJ</option><option>Estágio</option><option>Aprendiz</option>
        </select></div>
      <div style={field}><RenderCounter label="regime" />
        <select className="heavy-field" value={workMode} onChange={(e) => setWorkMode(e.target.value)}>
          <option value="">Regime…</option><option>Presencial</option><option>Híbrido</option><option>Remoto</option>
        </select></div>
      <div style={field}><RenderCounter label="gestor" /><HeavyField placeholder="Gestor" value={manager} onChange={(e) => setManager(e.target.value)} /></div>

      <h4>Bancários</h4>
      <div style={field}><RenderCounter label="banco" /><HeavyField placeholder="Banco" value={bank} onChange={(e) => setBank(e.target.value)} /></div>
      <div style={field}><RenderCounter label="ag" /><HeavyField placeholder="Agência" value={agency} onChange={(e) => setAgency(e.target.value)} /></div>
      <div style={field}><RenderCounter label="conta" /><HeavyField placeholder="Conta" value={account} onChange={(e) => setAccount(e.target.value)} /></div>
      <div style={field}><RenderCounter label="tipo-c" />
        <select className="heavy-field" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
          <option value="">Tipo de conta…</option><option>Corrente</option><option>Poupança</option><option>Salário</option>
        </select></div>

      <h4>Dependentes ({dependents.length})</h4>
      {dependents.map((dep, i) => (
        <div key={i} className="card" style={{ marginBottom: 8 }}>
          <RenderCounter label={`dep ${i + 1}`} />
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <HeavyField placeholder="Nome" value={dep.name} onChange={(e) => setDependents((ds) => ds.map((d, j) => (j === i ? { ...d, name: e.target.value } : d)))} />
            <select className="heavy-field" value={dep.kinship} onChange={(e) => setDependents((ds) => ds.map((d, j) => (j === i ? { ...d, kinship: e.target.value } : d)))}>
              <option value="">Parentesco…</option><option>Filho(a)</option><option>Cônjuge</option><option>Enteado(a)</option><option>Outro</option>
            </select>
            <HeavyField type="date" value={dep.birthDate} onChange={(e) => setDependents((ds) => ds.map((d, j) => (j === i ? { ...d, birthDate: e.target.value } : d)))} aria-label="Nascimento do dependente" />
            <button type="button" className="btn" onClick={() => setDependents((ds) => ds.filter((_, j) => j !== i))}>Remover</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => setDependents((ds) => [...ds, { name: "", kinship: "", birthDate: "" }])}>+ Adicionar dependente</button>

      <h4>Acesso</h4>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} /> Li e aceito os termos
        <RenderCounter label="aceite" />
      </label>
      <div style={field}><RenderCounter label="senha" /><HeavyField type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <div style={field}><RenderCounter label="conf" /><HeavyField type="password" placeholder="Confirmar senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>

      <button type="submit" className="btn btn-good" style={{ marginTop: 12 }}>Validar cadastro</button>
      {errors.length > 0 && (
        <ul style={{ color: "#b91c1c", fontSize: 14 }}>
          {errors.map((er, i) => <li key={i}>{er}</li>)}
        </ul>
      )}
      {ok && <p style={{ color: "#15803d", fontWeight: 700 }}>{ok}</p>}
    </form>
  );
}
