import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// StrictMode desligado de propósito: ele dobra os renders em dev
// e estraga os contadores (RenderCounter) e o FpsMeter da apresentação.
// retry: 0 mantém o contador de requisições honesto nas demos.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 0, staleTime: 0, refetchOnWindowFocus: true },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
  </QueryClientProvider>,
);
