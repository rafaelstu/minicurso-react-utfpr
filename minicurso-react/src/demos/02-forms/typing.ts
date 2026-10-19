// Helper de demonstração (não é conteúdo do minicurso): preenche o formulário
// campo a campo, "digitando" em blocos de alguns caracteres por tick.
import type { DemoValue, DemoValues } from "./demoData";

const CHARS_PER_TICK = 6;
const TICK_MS = 12;

// Datas entram de uma vez: valor parcial (ex. "1992-05-") é inválido no input date.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export type ApplyValue = (field: string, value: DemoValue) => void;

// Aplica values na ordem das chaves: um campo string (parcial) por tick;
// boolean e listas entram inteiros, no mesmo tick. Chame o retorno para cancelar.
export function typeFill(values: DemoValues, apply: ApplyValue, onDone: () => void): () => void {
  const entries = Object.entries(values) as [string, DemoValue][];
  let index = 0;
  let typed = 0;
  let stopped = false;

  const timer = setInterval(() => {
    if (stopped) return;
    while (index < entries.length) {
      const [field, value] = entries[index];
      if (typeof value === "string" && !ISO_DATE.test(value)) {
        typed = Math.min(typed + CHARS_PER_TICK, value.length);
        apply(field, value.slice(0, typed));
        if (typed < value.length) return;
        index += 1;
        typed = 0;
        continue;
      }
      apply(field, value);
      index += 1;
    }
    clearInterval(timer);
    if (!stopped) onDone();
  }, TICK_MS);

  return () => {
    stopped = true;
    clearInterval(timer);
  };
}
