# Minicurso React — do tutorial ao mercado (demos ao vivo)

Projeto de demonstração do minicurso. Cada aba mostra lado a lado a versão **ruim**
(tutorial / legado) e a versão **boa** (padrão atual de mercado). O problema da versão
ruim é visível: contador de renders, FPS, lag ao digitar.

## Como rodar

```bash
cd minicurso-react
npm install
npm run dev    # abre em http://localhost:5173
npm run build  # tsc + build de produção
npm run slides # copia o PDF dos slides (raiz do repo) para public/slides.pdf
```

> `StrictMode` está desligado em `src/main.tsx` de propósito: ele dobra os renders
> em dev e estragaria os contadores da apresentação.

## Navegação

Menu lateral no desktop, abas no topo no mobile. Dá para alternar de 3 jeitos:

- clicando no menu;
- teclas `0` (início) a `6` (demos) — útil no projetor;
- URL com hash: `#/`, `#/estilizacao`, `#/formularios`, `#/estado`, `#/dados`, `#/graficos`, `#/ia`.

A tecla `S` (ou o botão “Slides” no menu) abre o PDF do minicurso embutido ao lado
das demos — bom para apresentar sem alternar de janela. No desktop, o menu lateral
vira um rail de números enquanto os slides estão abertos, e o conteúdo ganha
espaço; no mobile, o painel ancorado vira uma bottom sheet (fecha no `×` ou no
`S`). Com o painel aberto, `←`/`→` (ou `PgUp`/`PgDn`) trocam de página;
aberto/fechado e página ficam no `localStorage` (ou `?slides=1` na URL para já
abrir com o painel). O PDF vem de `public/slides.pdf` e é desenhado com pdf.js num
`<canvas>` — baixa uma vez só e trocar de página não pisca. Na barra do painel dá
para soltá-lo como uma janelinha flutuante na própria página — arraste pela barra,
redimensione pelo canto — ou em tela cheia (Esc sai); flutuando, a demo usa a tela
toda atrás e o painel é limitado à viewport também no mobile. Para atualizar
depois de editar os slides, rode `npm run slides`.
O `FpsMeter` fica fixo no canto em todas as abas (vermelho abaixo de 30 FPS); com
o painel de slides aberto no desktop, ele muda para a esquerda, ao lado do rail,
para não cobrir o PDF.

O DevTools do TanStack Query não aparece mais por padrão (o botão flutuante cobria
o FPS); para abrir, use `?devtools` na URL.

### Acessibilidade

- `<html lang="pt-BR">`, um `h1` por tela (visualmente oculto no app), título da
  janela atualizado por aba e link “Pular para o conteúdo”.
- Foco visível de 2px em todos os controles, com contraste; campos de formulário
  com borda mais escura e placeholder legível.
- Formulários com nome acessível em todos os campos (`HeavyField` usa o placeholder
  como `aria-label` quando não há label), erros com `role="alert"`, tipos
  `email`/`tel` e selects rotulados.
- Seletores de versão usam `role="group"` + `aria-pressed`; troca de aba e página
  dos slides são anunciadas em live regions; botões de copiar e fechar estão em
  português e o canvas dos slides tem rótulo.

## O que cada aba mostra

| Aba | Ruim × Bom | O que observar |
|-----|------------|----------------|
| **1. Estilização** | styled-components × Ant Design × shadcn/ui (mesmo card “Plano Pro”) | DevTools → Elements: tags `<style>` e hash vs. classes utilitárias. Customização com `!important` vs. variante `brand` no `button.tsx`. “Ver código” abre um modal largo com o fonte real do arquivo (`?raw`) e botão copiar. |
| **2. Formulários** | `useState` (40+ campos RH) × RHF `register` × RHF + Controller + Zod | Digite: no ruim todos os `RenderCounter` sobem e o FPS cai. No RHF o geral fica parado. Mesmo `HeavyField` nas 3 versões. Demo extra: TS sozinho (`as Employee`) quebra em runtime; Zod mostra erros legíveis. |
| **3. Estado** | Context único × Zustand com seletores (`ticker` a cada 16ms, grade 50/500/2000) | Com ticker ligado + 500 itens, o input trava no Context e fica fluido no Zustand. Só relógio/progresso re-renderizam no bom. |
| **4. Dados** | `useEffect` à mão × Axios + TanStack Query (jsonplaceholder) | Clique rápido com atraso ligado: race condition no ruim, sem race no bom. Voltar de aba: ruim refaz loading, bom mostra cache + `isFetching`. Mutação com invalidação e rollback otimista (switch “forçar falha”). |
| **5. Gráficos** | ApexCharts (SVG) × ECharts (Canvas), mesmo dataset 1k / 20k / 100k | Tempo até o primeiro paint medido igual nos dois; FPS no zoom. Apex bonito até ~1k e travando em 20k (100k bloqueado com aviso); ECharts com `dataZoom` + `sampling: lttb` aguenta 100k fluido. |
| **6. IA** | IA como oráculo × IA como copiloto | Tem que usar — todo dia. A diferença é contexto na entrada e diff revisado na saída: prompt com stack/versão/arquivo, plano antes do código, build+lint+teste antes do aceite. Riscos: alucinação de API, segredo no chat e merge sem leitura. |

## Estrutura

```
src/
  App.tsx                 # menu de navegação (estado local + hash, sem router)
  main.tsx                # StrictMode desligado + QueryClientProvider + devtools (?devtools)
  lib/utils.ts            # cn (clsx + tailwind-merge)
  components/
    RenderCounter.tsx     # badge de renders (useRef, durante o render)
    FpsMeter.tsx          # FPS via requestAnimationFrame
    SlidesPanel.tsx       # painel de slides (pdf.js em canvas, sem recarregar)
    HeavyField.tsx        # input com custo simulado (COST_MS ajustável)
    ui/                   # componentes shadcn (o código é seu)
  demos/
    01-styling/           # PRONTO (§4): StyledComponents / Antd (+!important) / Shadcn (+variante brand)
    02-forms/             # PRONTO (§5): useState / RhfRegister / RhfController + schema + TS×Zod
    03-state/             # PRONTO (§6): ContextBad / ZustandGood
    04-data/              # PRONTO (§7): api.ts + AxiosVsFetch + UseEffectBad + UseQueryGood + MutationDemo
    05-charts/            # PRONTO (§8): ApexDemo / EchartsDemo + useRenderTime
    06-ia/                # tela de fechamento: IA como copiloto (sem interação)
```

As 5 demos + a tela de IA implementadas. O `HANDOFF.md` (raiz do repo) tem a spec de cada demo.

## Roteiro de apresentação

- **Slides:** aperte `S` no projetor e apresente com o PDF ao lado da demo viva
  (`←`/`→` trocam de página; `S` de novo fecha).
- **Estilização:** “Ver código” nas três colunas; no DevTools → Elements mostre as
  tags `<style>` e classes com hash do styled/antd contra as utilitárias do Tailwind.
  No antd, mostre a caixa “pedido do designer” (`!important` vs. tokens do
  `ConfigProvider`); no shadcn, a variante `brand` criada no `button.tsx`.
- **Forms:** em cada aba, clique em “Digitar rápido (incorreto)” / “(correto)”:
  o formulário se preenche campo a campo e valida no final (incorreto = erros
  vermelhos; correto = mensagem verde). Na aba “useState (ruim)” os contadores
  todos sobem e o FPS cai; em “RHF register” o geral fica parado. Em
  “RHF + Controller”: mude a data de nascimento — só o badge “idade” re-renderiza.
  Embaixo: botões “abc no salário” e “API incompleta” mostram crash silencioso (TS)
  vs. erros legíveis (Zod).
- **Estado:** ligue o ticker com ~500 componentes e digite no input. No Context o
  input trava e todos os `r` sobem; no Zustand fica fluido e os `r` ficam parados.
- **Dados:** com o atraso ligado, clique rápido entre posts na aba “useEffect (ruim)”:
  aparece o aviso de race condition. Volte de aba: loading de novo. Na aba
  “TanStack Query”, os mesmos cliques não têm race, voltar de aba vem do cache e
  desfocar/focar a janela dispara refetch. “Mutação + otimista”: publique um post
  (veja a invalidação refazer a lista) e ligue “forçar falha” no curtir para ver o
  rollback. “Axios × fetch”: mesmo 404, fetch “sucede”, axios cai no catch.
- **Gráficos:** suba 1k → 20k → 100k e acompanhe a tabela de tempo. Em 20k o Apex
  engasga (SVG) e em 100k fica bloqueado com aviso; no ECharts dê zoom/arraste o
  slider com 100k e acompanhe o FPS no canto.
- **IA:** feche dizendo que não é opcional: o mercado cobra IA no fluxo. Passe pelos
  dois cards (oráculo × copiloto), pelo prompt que funciona e pela régua final — se
  você não consegue explicar o que a IA escreveu, ainda não terminou.

## Checklist de aceite (HANDOFF §10)

- [x] `npm run dev` sobe e `npm run build` passa.
- [x] StrictMode desligado, com comentário explicando.
- [x] FpsMeter visível em todas as abas.
- [x] Formulário ruim: contadores sobem em tudo a cada tecla; RHF: não sobem.
- [x] TS puro quebra em runtime; Zod mostra erros legíveis.
- [x] Context trava com 500+ e ticker ligado; Zustand fluido.
- [x] useEffect: race condition reproduzível; useQuery: cache e sem race.
- [x] Mutação com invalidação e rollback via “forçar falha”.
- [x] Gráficos: mesmo dataset, tempo exibido para 1k/20k/100k.
- [x] Cada arquivo de demo com comentário no topo explicando o porquê.
- [x] README curto explicando como rodar e o que cada aba mostra.
