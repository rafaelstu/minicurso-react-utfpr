// BOM — camada de API única (axios) usada pelas DUAS versões da demo.
// O que muda entre a versão ruim e a boa é quem consome, não a API.
import axios from "axios";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Token fake em memória: o request interceptor injeta como se fosse real.
// Em produção, viria do store de autenticação.
let fakeToken = "fake-jwt-do-minicurso";
export const setFakeToken = (t: string) => {
  fakeToken = t;
};

// Atraso artificial aleatório (200–1500ms) para provocar race conditions.
// Controlado pelo switch na interface (DelayToggle).
let delayEnabled = true;
export const isDelayEnabled = () => delayEnabled;
export const setDelayEnabled = (v: boolean) => {
  delayEnabled = v;
};
export const artificialDelay = () =>
  delayEnabled ? sleep(200 + Math.random() * 1300) : Promise.resolve();

// Contador observável de requisições (comparação entre as versões na tela).
export const reqStats = { count: 0 };
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
export function subscribeStats(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
export function resetStats() {
  reqStats.count = 0;
  notify();
}

export const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 15000,
});

// Request interceptor: auth + atraso artificial (vai antes da requisição sair).
api.interceptors.request.use(async (config) => {
  reqStats.count += 1;
  notify();
  config.headers.Authorization = `Bearer ${fakeToken}`;
  if (delayEnabled) await sleep(200 + Math.random() * 1300);
  return config;
});

// Response interceptor com o gancho de silent refresh (padrão de mercado):
// se 401, chamaria POST /refresh-token e repetiria a requisição original.
// A API do jsonplaceholder não devolve 401 de verdade — fica o gancho real.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.log(
        "[api] 401 → aqui chamaria /refresh-token e repetiria a requisição original",
      );
      // error.config._retried = true;
      // return api.request(error.config);
    }
    return Promise.reject(error);
  },
);

export type Post = { id: number; userId: number; title: string; body: string };
export type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};

export const getPosts = () => api.get<Post[]>("/posts").then((r) => r.data);
export const getPost = (id: number) =>
  api.get<Post>(`/posts/${id}`).then((r) => r.data);
export const getComments = (postId: number) =>
  api.get<Comment[]>(`/posts/${postId}/comments`).then((r) => r.data);
export const createPost = (data: { title: string; body: string }) =>
  api.post<Post>("/posts", data).then((r) => r.data);
