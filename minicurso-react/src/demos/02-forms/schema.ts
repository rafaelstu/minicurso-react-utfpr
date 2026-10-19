// BOM — fonte única da verdade: um schema Zod com todas as regras.
// O tipo Employee sai de z.infer, sem interface manual duplicada.
import { z } from "zod";

// Valida dígitos verificadores do CPF (recebe com ou sem máscara).
export function isValidCpf(raw: string): boolean {
  const d = raw.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10]);
}

export function calcAge(birthIso: string): number | null {
  if (!birthIso) return null;
  const b = new Date(birthIso + "T00:00:00");
  if (Number.isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1;
  return age;
}

const emailMsg = "E-mail inválido. Ex.: nome@empresa.com";
const required = "Campo obrigatório.";

export const employeeSchema = z
  .object({
    // — Dados pessoais —
    fullName: z.string().min(5, "Nome completo (nome + sobrenome)."),
    socialName: z.string().optional(),
    birthDate: z
      .string()
      .min(1, required)
      .refine((v) => {
        const age = calcAge(v);
        return age !== null && age >= 16;
      }, "Precisa ter 16 anos ou mais."),
    cpf: z
      .string()
      .min(1, required)
      .refine(isValidCpf, "CPF inválido (dígitos não conferem)."),
    rg: z.string().min(5, "RG incompleto."),
    gender: z.string().min(1, required),
    maritalStatus: z.string().min(1, required),
    nationality: z.string().min(2, required),
    motherName: z.string().min(5, "Informe o nome da mãe."),
    fatherName: z.string().optional(),

    // — Contato —
    personalEmail: z.string().min(1, required).email(emailMsg),
    workEmail: z.string().min(1, required).email(emailMsg),
    phone: z.string().regex(/^(\D*\d\D*){10,11}$/, "Telefone com DDD (10 ou 11 dígitos)."),
    mobile: z.string().regex(/^(\D*\d\D*){10,11}$/, "Celular com DDD (10 ou 11 dígitos)."),
    emergencyName: z.string().min(3, required),
    emergencyPhone: z.string().regex(/^(\D*\d\D*){10,11}$/, "Telefone de emergência inválido."),

    // — Endereço —
    zip: z.string().regex(/^\d{5}-?\d{3}$/, "CEP no formato 00000-000."),
    street: z.string().min(3, required),
    number: z.string().min(1, required),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, required),
    city: z.string().min(2, required),
    state: z.string().length(2, "UF com 2 letras."),

    // — Profissional —
    role: z.string().min(2, required),
    department: z.string().min(2, required),
    salary: z.coerce.number({ message: "Salário precisa ser número." }).min(1518, "Abaixo do mínimo (R$ 1.518)."),
    hireDate: z.string().min(1, required),
    contractType: z.string().min(1, "Escolha o tipo de contrato."),
    workMode: z.string().min(1, "Escolha o regime."),
    manager: z.string().min(3, required),

    // — Bancários —
    bank: z.string().min(2, required),
    agency: z.string().min(3, "Agência incompleta."),
    account: z.string().min(4, "Conta incompleta."),
    accountType: z.string().min(1, "Escolha o tipo de conta."),

    // — Dependentes (lista dinâmica) —
    dependents: z
      .array(
        z.object({
          name: z.string().min(3, "Nome do dependente."),
          kinship: z.string().min(1, "Parentesco."),
          birthDate: z.string().min(1, required),
        }),
      )
      .default([]),

    // — Termos —
    accept: z.boolean().refine((v) => v === true, "Você precisa aceitar os termos."),
    password: z.string().min(6, "Senha com no mínimo 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirme a senha."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Senhas não conferem.",
    path: ["confirmPassword"],
  });

// Tipo usado nos formulários bons. Nada de interface duplicada.
export type Employee = z.infer<typeof employeeSchema>;
