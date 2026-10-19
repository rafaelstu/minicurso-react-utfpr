// BOM — input com custo de render simulado para a diferença aparecer em qualquer máquina.
// O MESMO HeavyField é usado nas 3 versões do formulário (demo 2).
// A diferença vem só de quantos renders cada abordagem dispara, não do input em si.
// Ajuste COST_MS se o lag estiver fraco ou forte demais no projetor.
import { memo } from "react";

// Custo aproximado por render. 1 a 2ms é suficiente com 40+ campos.
export const HEAVY_FIELD_COST_MS = 1.5;

function burn(ms: number) {
  const start = performance.now();
  while (performance.now() - start < ms) {
    // loop síncrono de propósito: simula componente pesado
  }
}

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  costMs?: number;
  // ref como prop (React 19): necessário p/ react-hook-form register funcionar.
  ref?: React.Ref<HTMLInputElement>;
};

// memo não salva no caso ruim: se o pai re-renderiza e passa value/onChange
// novos, ele re-renderiza mesmo assim. No RHF register o pai NÃO re-renderiza,
// então o custo só paga uma vez. É isso que medimos.
export const HeavyField = memo(function HeavyField({ costMs = HEAVY_FIELD_COST_MS, ref, ...rest }: Props) {
  burn(costMs);
  return <input ref={ref} {...rest} className={`heavy-field ${rest.className ?? ""}`} />;
});
