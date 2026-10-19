// Painel de slides: renderiza o PDF (public/slides.pdf) num <canvas> com pdf.js.
// O iframe nativo recarrega o arquivo inteiro a cada troca de página (flash branco);
// aqui o documento é baixado uma única vez e cada página só redesenha o canvas.
// A página nova é desenhada num canvas fora da tela e só aparece quando fica
// pronta (double buffer) — trocar de página não pisca.
// Dá para soltar como uma janelinha flutuante sobre a própria página (arraste
// pela barra, redimensione pelo canto) ou em tela cheia.
// Atualizar o PDF depois de editar o pptx: npm run slides.
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Maximize2Icon, Minimize2Icon, PictureInPicture2Icon } from "lucide-react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";

export function SlidesPanel({
  page,
  floating,
  onToggleFloat,
  onTotal,
  onPrev,
  onNext,
  onClose,
}: {
  page: number;
  floating: boolean;
  onToggleFloat: () => void;
  onTotal: (total: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement | null>(null);
  const floatRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadingRef = useRef<PDFDocumentLoadingTask | null>(null);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const renderRef = useRef<RenderTask | null>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const [total, setTotal] = useState(0);
  const [width, setWidth] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState({ w: 460, h: 300 });

  // Baixa o pdf.js e o PDF — só quando o painel abre (não pesa o bundle inicial)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        const task = pdfjs.getDocument({ url: "/slides.pdf" });
        loadingRef.current = task;
        const doc = await task.promise;
        if (!alive) return;
        docRef.current = doc;
        setTotal(doc.numPages);
        onTotal(doc.numPages);
      } catch (e) {
        console.error("Falha ao carregar o PDF dos slides:", e);
        if (alive) setError("Não deu para carregar public/slides.pdf — rode npm run slides e recarregue.");
      }
    })();
    return () => {
      alive = false;
      renderRef.current?.cancel();
      loadingRef.current?.destroy().catch(() => {});
      loadingRef.current = null;
      docRef.current = null;
    };
  }, [onTotal]);

  // Acompanha a largura do painel para redesenhar nítido (dpr) e sem distorção
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => setWidth(wrap.clientWidth));
    ro.observe(wrap);
    setWidth(wrap.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Sincroniza o estado do botão de tela cheia (o Esc sai por fora)
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const doc = el.ownerDocument;
    const onChange = () => setFullscreen(doc.fullscreenElement === el);
    doc.addEventListener("fullscreenchange", onChange);
    return () => {
      doc.removeEventListener("fullscreenchange", onChange);
      if (doc.fullscreenElement === el) void doc.exitFullscreen();
    };
  }, []);

  // Desenha a página pedida — primeiro num canvas fora da tela, depois troca
  useEffect(() => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (!doc || !canvas || !total || !width) return;

    let alive = true;
    renderRef.current?.cancel();

    doc.getPage(Math.min(page, total)).then(async (pdfPage) => {
      if (!alive) return;
      const unscaled = pdfPage.getViewport({ scale: 1 });
      const viewport = pdfPage.getViewport({ scale: width / unscaled.width });
      const dpr = window.devicePixelRatio || 1;

      const buffer = document.createElement("canvas");
      buffer.width = Math.floor(viewport.width * dpr);
      buffer.height = Math.floor(viewport.height * dpr);

      const task = pdfPage.render({
        canvas: buffer,
        viewport,
        transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
      });
      renderRef.current = task;
      try {
        await task.promise;
      } catch {
        return; // cancelada por outra troca de página — mantém o que está na tela
      }
      if (!alive) return;

      const target = canvasRef.current;
      if (!target) return;
      target.width = buffer.width;
      target.height = buffer.height;
      target.style.width = `${Math.floor(viewport.width)}px`;
      target.style.height = `${Math.floor(viewport.height)}px`;
      target.getContext("2d")?.drawImage(buffer, 0, 0);
    });

    return () => {
      alive = false;
    };
  }, [page, total, width]);

  function toggleFullscreen() {
    const el = panelRef.current;
    if (!el) return;
    const doc = el.ownerDocument;
    if (doc.fullscreenElement) void doc.exitFullscreen();
    else void el.requestFullscreen();
  }

  // Arrasta a janelinha flutuante pela barra (ignora cliques nos botões)
  function onBarPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("button")) return;
    const rect = floatRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onBarPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current || !floatRef.current) return;
    const w = floatRef.current.offsetWidth;
    const h = floatRef.current.offsetHeight;
    setPos({
      x: Math.min(Math.max(e.clientX - dragRef.current.dx, 0), window.innerWidth - w),
      y: Math.min(Math.max(e.clientY - dragRef.current.dy, 0), window.innerHeight - h),
    });
  }

  function onBarPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  // Redimensiona pelo canto inferior direito
  function onResizePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    resizeRef.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onResizePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const s = resizeRef.current;
    if (!s) return;
    setSize({
      w: Math.max(260, Math.min(s.w + (e.clientX - s.x), window.innerWidth)),
      h: Math.max(180, Math.min(s.h + (e.clientY - s.y), window.innerHeight)),
    });
  }

  function onResizePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    resizeRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  const panel = (
    <aside ref={panelRef} className="slides-panel" aria-label="Slides da apresentação">
      <div
        className="slides-bar"
        {...(floating
          ? {
              onPointerDown: onBarPointerDown,
              onPointerMove: onBarPointerMove,
              onPointerUp: onBarPointerUp,
              onPointerCancel: onBarPointerUp,
            }
          : {})}
      >
        <strong>Slides</strong>
        <span className="muted slides-hint">← → trocam de página</span>
        <div className="slides-controls">
          <button type="button" className="btn slides-btn" onClick={onPrev} aria-label="Página anterior">
            ◀
          </button>
          <span className="slides-page">
            p. {page}
            {total > 0 ? ` / ${total}` : ""}
          </span>
          <button type="button" className="btn slides-btn" onClick={onNext} aria-label="Próxima página">
            ▶
          </button>
          <button
            type="button"
            className="btn slides-btn"
            onClick={onToggleFloat}
            title={floating ? "Trazer de volta para o painel lateral" : "Flutuar sobre a página"}
            aria-label={floating ? "Trazer de volta para o painel lateral" : "Flutuar sobre a página"}
          >
            <PictureInPicture2Icon size={14} />
          </button>
          <button
            type="button"
            className="btn slides-btn"
            onClick={toggleFullscreen}
            title={fullscreen ? "Sair da tela cheia (Esc)" : "Tela cheia"}
            aria-label={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            {fullscreen ? <Minimize2Icon size={14} /> : <Maximize2Icon size={14} />}
          </button>
          <button type="button" className="btn slides-btn" onClick={onClose} aria-label="Fechar slides (tecla S)">
            ✕
          </button>
        </div>
      </div>
      <div ref={wrapRef} className="slides-canvas-wrap">
        {error ? (
          <p className="muted" style={{ padding: 16 }}>
            {error}
          </p>
        ) : (
          <canvas ref={canvasRef} className="slides-canvas" />
        )}
      </div>
    </aside>
  );

  // O wrapper é estável nos dois modos (display: contents quando ancorado) para o
  // React não remontar o <canvas> e perder o render ao alternar flutuante/painel.
  return (
    <div
      ref={floatRef}
      className={floating ? "slides-float" : "slides-hold"}
      style={
        floating
          ? {
              width: size.w,
              height: size.h,
              ...(pos ? { left: pos.x, top: pos.y, right: "auto" } : {}),
            }
          : undefined
      }
    >
      {panel}
      {floating && (
        <div
          className="slides-resize"
          role="separator"
          aria-label="Redimensionar painel de slides"
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerUp}
        />
      )}
    </div>
  );
}
