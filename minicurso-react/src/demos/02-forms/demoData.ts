// Dados de exemplo compartilhados pelas 3 versões do formulário (demo 2).
// "incorreto" viola ~18 regras do schema; "correto" passa em todas.
// A digitação automática aplica estes datasets campo a campo (ver typing.ts).
import type { Employee } from "./schema";

export type DemoDependent = { name: string; kinship: string; birthDate: string };

// Strings (na ordem dos campos) + boolean + lista de dependentes.
export type DemoValue = string | boolean | DemoDependent[];

// Record amarrado a Employee: campo novo no schema obriga a completar os datasets.
export type DemoValues = Record<keyof Employee, DemoValue>;

export const incorrectEmployee: DemoValues = {
  // — Dados pessoais —
  fullName: "Ana",
  socialName: "",
  birthDate: "2015-06-20",
  cpf: "111.111.111-11",
  rg: "123",
  gender: "",
  maritalStatus: "",
  nationality: "B",
  motherName: "Jo",
  fatherName: "",
  // — Contato —
  personalEmail: "ana.sem-arroba",
  workEmail: "ana@empresa",
  phone: "411234",
  mobile: "(41) 9123-45",
  emergencyName: "Lu",
  emergencyPhone: "413333",
  // — Endereço —
  zip: "8000",
  street: "Ru",
  number: "",
  complement: "",
  neighborhood: "C",
  city: "C",
  state: "Paraná",
  // — Profissional —
  role: "A",
  department: "D",
  salary: "abc",
  hireDate: "",
  contractType: "",
  workMode: "",
  manager: "Ro",
  // — Bancários —
  bank: "",
  agency: "",
  account: "",
  accountType: "",
  // — Dependentes + termos —
  dependents: [{ name: "Lu", kinship: "", birthDate: "" }],
  accept: false,
  password: "123",
  confirmPassword: "456",
};

export const correctEmployee: DemoValues = {
  // — Dados pessoais —
  fullName: "Maria da Silva Santos",
  socialName: "Maria Santos",
  birthDate: "1992-05-14",
  cpf: "529.982.247-25",
  rg: "12.345.678-9",
  gender: "Feminino",
  maritalStatus: "Casado(a)",
  nationality: "Brasileira",
  motherName: "Joana da Silva",
  fatherName: "José Carlos Santos",
  // — Contato —
  personalEmail: "maria.santos@gmail.com",
  workEmail: "maria.santos@empresa.com.br",
  phone: "(41) 3333-4444",
  mobile: "(41) 99999-8888",
  emergencyName: "José Santos",
  emergencyPhone: "(41) 98888-7777",
  // — Endereço —
  zip: "80000-000",
  street: "Rua das Flores",
  number: "120",
  complement: "Apto 42",
  neighborhood: "Centro",
  city: "Curitiba",
  state: "PR",
  // — Profissional —
  role: "Analista de Sistemas",
  department: "Tecnologia",
  salary: "8500",
  hireDate: "2024-03-01",
  contractType: "CLT",
  workMode: "Híbrido",
  manager: "Roberto Lima",
  // — Bancários —
  bank: "Banco do Brasil",
  agency: "1234-5",
  account: "12345-6",
  accountType: "Corrente",
  // — Dependentes + termos —
  dependents: [{ name: "Lucas Santos", kinship: "Filho(a)", birthDate: "2018-09-10" }],
  accept: true,
  password: "senha123",
  confirmPassword: "senha123",
};
