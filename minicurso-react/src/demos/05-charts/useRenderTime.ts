// Mede o custo de render de um gráfico: da troca do dataset até o primeiro paint.
// O início é marcado no render (antes de o gráfico atualizar) e o fim depois de
// dois requestAnimationFrame — o segundo roda logo antes do paint seguinte.
// O MESMO hook nos dois gráficos, para a comparação ser justa.
// (O lint reclama de ref/performance.now no render, como no RenderCounter — aqui é de propósito.)
import { useEffect, useRef } from "react";

export function useRenderTime(
  data: unknown,
  onRenderTime: (ms: number) => void,
  enabled = true,
) {
  const lastData = useRef<unknown>(null);
  const startedAt = useRef(0);
  const callback = useRef(onRenderTime);

  if (lastData.current !== data) {
    lastData.current = data;
    startedAt.current = performance.now();
  }

  useEffect(() => {
    callback.current = onRenderTime;
  });

  useEffect(() => {
    if (!enabled) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        const ms = Math.round((performance.now() - startedAt.current) * 10) / 10;
        callback.current(ms);
      });
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [data, enabled]);
}
