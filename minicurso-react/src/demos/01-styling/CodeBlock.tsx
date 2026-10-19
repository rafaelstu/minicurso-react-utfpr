// "Ver código" em modal: o Vite importa o próprio fonte do arquivo com ?raw e abre
// num Dialog largo — a coluna de 1/3 da grade é estreita demais pra ler código.
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

export function CodeBlock({ code, fileName }: { code: string; fileName: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard bloqueado (contexto não seguro) — ignora
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="btn"
          style={{ fontSize: 12.5, padding: "5px 10px", fontWeight: 600, marginTop: 8 }}
        >
          Ver código
        </button>
      </DialogTrigger>
      <DialogContent className="w-[min(1150px,94vw)] max-w-[min(1150px,94vw)] gap-0 overflow-hidden p-0 sm:max-w-[min(1150px,94vw)]">
        <DialogHeader className="border-b border-[var(--border)] px-4 py-3">
          <DialogTitle>{fileName}</DialogTitle>
          <DialogDescription>
            Fonte real do arquivo desta coluna (importado com <code>?raw</code>).
          </DialogDescription>
        </DialogHeader>
        <div className="code-modal-wrap">
          <button type="button" className="btn code-modal-copy" onClick={copy}>
            {copied ? "Copiado!" : "Copiar"}
          </button>
          <pre className="code-modal">{code}</pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
