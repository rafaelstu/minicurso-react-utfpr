# Handoff: projeto de demos do minicurso de React

## Contexto

Estou montando um minicurso de React para o mercado de trabalho. Os slides (`.pptx`) estão anexados e explicam a teoria. Este projeto serve para **mostrar na prática** a diferença entre "como era" e "como é hoje", ao vivo, durante a apresentação.

Existe um projeto Vite + React + TypeScript limpo. Seu trabalho é instalar as dependências e construir as demos descritas abaixo.

**Princípio geral:** cada demo tem uma versão **ruim** (a que a gente vê em tutorial e em código legado) e uma versão **boa** (o padrão atual do mercado). Elas ficam lado a lado, em arquivos separados, para eu abrir o código e mostrar no projetor. O problema da versão ruim precisa ser **visível**: contador de renders, FPS, lag ao digitar.

**Regras de código:**
- A versão ruim deve ser ruim de verdade, mas funcionar. Nada de código quebrado de propósito.
- A versão boa deve ser curta e legível, porque vira print em slide.
- Comentários no topo de cada arquivo dizendo "RUIM" ou "BOM" e em uma linha o porquê.
- Português nos textos da interface e nos comentários. Identificadores de código em inglês.
- Sem texto genérico de IA nos comentários. Direto ao ponto.

---

## 1. Instalação

```bash
# base
npm i tailwindcss @tailwindcss/vite
npm i -D @types/node

# demo 1: estilização
npm i styled-components antd lucide-react
# shadcn: depois de configurar o alias "@" (ver abaixo)
npx shadcn@latest init
npx shadcn@latest add button card input label dialog select checkbox tabs badge separator textarea switch

# demo 2: formulários
npm i react-hook-form zod @hookform/resolvers

# demo 3: estado
npm i zustand

# demo 4: dados
npm i axios @tanstack/react-query @tanstack/react-query-devtools

# demo 5: gráficos
npm i apexcharts react-apexcharts echarts echarts-for-react
```

Configuração necessária antes do `shadcn init`:
- Tailwind v4: `@import "tailwindcss";` no `src/index.css` e o plugin `@tailwindcss/vite` no `vite.config.ts`.
- Alias `@` apontando para `./src` no `vite.config.ts` **e** em `tsconfig.json`/`tsconfig.app.json` (`paths`).
- No `shadcn init`, escolher base **Radix**.
- Se o componente `form` do shadcn não existir mais na CLI, usar o componente `field` ou montar um `FormField` próprio com `Controller`. Confira a documentação atual do shadcn.
- Se `styled-components` ou `antd` pedirem algo diferente na versão instalada, siga a documentação deles.

**Importante:** desligar o `<React.StrictMode>` em `main.tsx`. Ele dobra os renders em desenvolvimento e estraga os contadores. Deixar um comentário explicando.

---

## 2. Estrutura sugerida

```
src/
  main.tsx
  App.tsx                      # layout com abas/menu lateral, uma aba por demo
  components/
    RenderCounter.tsx          # badge que mostra quantas vezes o componente renderizou
    FpsMeter.tsx               # FPS no canto da tela (requestAnimationFrame)
    HeavyField.tsx             # wrapper de input com custo de render simulado (ver demo 2)
    CodeBlock.tsx              # opcional: mostra o código-fonte via import "?raw"
  demos/
    01-styling/
      StyledComponentsDemo.tsx
      AntdDemo.tsx
      ShadcnDemo.tsx
      index.tsx                # os 3 lado a lado
    02-forms/
      FormBadUseState.tsx
      FormRhfRegister.tsx
      FormRhfController.tsx
      schema.ts                # schema Zod + tipo inferido
      ValidationTsOnly.tsx
      ValidationZod.tsx
      index.tsx
    03-state/
      ContextBad.tsx
      ZustandGood.tsx
      index.tsx
    04-data/
      api.ts                   # instância do axios
      UseEffectBad.tsx
      UseQueryGood.tsx
      MutationDemo.tsx
      AxiosVsFetch.tsx
      index.tsx
    05-charts/
      ApexDemo.tsx
      EchartsDemo.tsx
      index.tsx
```

O `App.tsx` deve ter navegação simples (estado local ou abas do shadcn, sem necessidade de router) com 5 abas, uma por demo.

---

## 3. Componentes utilitários

**RenderCounter:** badge pequeno que incrementa um `useRef` a cada render do componente em que está e mostra o número. Importante: incrementar durante o render, não em `useEffect`.

**FpsMeter:** fixo no canto da tela, conta frames por segundo com `requestAnimationFrame`. Fica vermelho abaixo de 30 FPS. Presente em todas as abas.

**HeavyField:** envolve um `<input>` e simula custo de renderização com um loop síncrono curto (cerca de 1 a 2 ms por render, configurável por prop). Ele existe para que a diferença entre as abordagens apareça em qualquer máquina, inclusive notebook potente. **O mesmo HeavyField é usado nas três versões do formulário**, então a diferença vem apenas de quantos renders cada abordagem dispara. Deixar um comentário no arquivo explicando isso, e uma constante fácil de ajustar.

---

## 4. Demo 1: Estilização (como era e como é)

**Objetivo:** mostrar styled-components, Ant Design e shadcn/ui resolvendo o **mesmo componente**, e deixar claro o custo de cada um.

**Componente alvo (igual nos três):** um card de "Plano Pro" com título, preço, lista de benefícios, botão primário, botão secundário e um botão que abre um modal de confirmação com um input de e-mail. Layout parecido nas três versões.

**`StyledComponentsDemo.tsx`**
- Usar `styled-components` (versão atual). Props transitórias com `$` (ex.: `$variant`).
- Componentes com nomes inventados (`Wrapper`, `InnerBox`, `PriceText`, `BenefitRow`) para ilustrar o cansaço mental dos nomes arbitrários.
- Pelo menos um styled com prop dinâmica (`$variant`) para mostrar que o CSS é gerado em runtime.
- Comentário no topo: CSS gerado via JS em runtime, classes com hash, sem suporte a RSC.

**`AntdDemo.tsx`**
- Usar `Card`, `Button`, `Modal`, `Input` do Ant Design.
- Incluir um caso de **customização dolorosa**: o designer pediu o botão com borda de 12px, cor própria e sombra diferente. Mostrar a tentativa via `className` + CSS com `!important` e/ou `ConfigProvider` com tokens. Deixar o trecho de `!important` visível no código e comentado como a "briga com a classe interna".
- Comentário no topo: componente fechado em `node_modules`, customização por override.

**`ShadcnDemo.tsx`**
- Usar `Card`, `Button`, `Dialog`, `Input`, `Label` do shadcn (arquivos em `src/components/ui`).
- Tailwind com tokens (`p-4`, `text-muted-foreground`, etc.).
- Para provar o ponto do "código é seu": **editar o `button.tsx`** adicionando uma variante nova (ex.: `variant="brand"`) e usar essa variante na demo. Comentar isso no topo do demo: "abri o button.tsx e mudei, sem !important".

**`index.tsx`:** os três componentes lado a lado em colunas (empilha no mobile), com legendas "styled-components", "Ant Design", "shadcn/ui". Abaixo de cada um, uma lista curta de "o que dói" e "o que ajuda". Opcional: botão "Ver código" abrindo o `?raw` do arquivo.

**Para mostrar na apresentação:** abrir o DevTools > Elements e mostrar as tags `<style>` e classes com hash geradas pelo styled-components e pelo Ant Design, contra as classes utilitárias do Tailwind.

**Atenção a conflito:** o preflight do Tailwind pode alterar o visual do Ant Design e dos styled-components. Se acontecer, isolar cada demo em um container e ajustar o que for necessário, mas **sem mexer no código que será mostrado**.

---

## 5. Demo 2: Formulários e validação

### 5.1 Cenário

Escolhi um **cadastro de colaborador (RH)** por ser um formulário longo e realista, com cerca de **40 campos** em seções:

- **Dados pessoais:** nome completo, nome social, data de nascimento, CPF, RG, sexo, estado civil, nacionalidade, nome da mãe, nome do pai
- **Contato:** e-mail pessoal, e-mail corporativo, telefone, celular, contato de emergência (nome e telefone)
- **Endereço:** CEP, rua, número, complemento, bairro, cidade, estado
- **Dados profissionais:** cargo, departamento, salário, data de admissão, tipo de contrato (select), regime (select), gestor
- **Dados bancários:** banco, agência, conta, tipo de conta
- **Dependentes:** lista dinâmica (nome, parentesco, data de nascimento) com adicionar e remover
- **Termos:** checkbox de aceite e senha de acesso + confirmação

Todos os campos usam o `HeavyField` (ou checkbox/select equivalentes) para o custo de render ser comparável.

### 5.2 Três versões do mesmo formulário

**`FormBadUseState.tsx` (O HORROR)**
- Um `useState` por campo (40+ `useState` no topo do componente).
- Um `onChange` por campo, ou um `handleChange` genérico com `setForm({...form, [name]: value})` guardando tudo em um único objeto de estado. Escolha o que ficar **mais feio e comum em código real**; pode usar a combinação: parte dos campos em `useState` individual, parte em objeto.
- Validação com dezenas de `if` manuais e regex soltas dentro do `handleSubmit`, incluindo CPF, e-mail, CEP e confirmação de senha.
- Componente único de 400+ linhas. A feiura **é o objetivo**.
- Resultado esperado ao digitar: **o formulário inteiro re-renderiza a cada tecla**. Com o RenderCounter em cada campo e um geral no formulário, o contador sobe em todos ao mesmo tempo, e o lag aparece com o FpsMeter.

**`FormRhfRegister.tsx`**
- React Hook Form com `register` (não controlado).
- Mostrar que o contador de renders do formulário **não sobe** ao digitar.
- Lista de dependentes com `useFieldArray`.

**`FormRhfController.tsx`** (versão "de mercado" com shadcn)
- React Hook Form com `Controller`/`FormField` para componentes controlados (`Select`, `Checkbox`, `Switch` do shadcn) e `register` onde fizer sentido.
- Mesmos campos, mesmas seções. Usar os componentes do shadcn.
- Mostrar `useWatch` ou `watch` isolado em apenas um campo (ex.: mostrar "idade calculada" a partir da data de nascimento) para explicar o re-render cirúrgico.
- Validação via `zodResolver` com o schema de `schema.ts` (ver 5.3).

**`index.tsx`:** abas "useState (ruim)", "RHF register", "RHF + Controller". Em cada aba, RenderCounter geral do formulário, FpsMeter visível e um texto curto explicando o que observar. Se possível, um botão "Digitar rápido" que dispara uma sequência de teclas programática no primeiro campo para o efeito ficar visível sem eu digitar.

### 5.3 Validação: só TypeScript vs. Zod

Criar `schema.ts` com o schema Zod do colaborador e `export type Employee = z.infer<typeof employeeSchema>`. Incluir regras que **mostram o poder do Zod**:
- CPF válido (função de validação de dígitos + `refine`)
- E-mail, CEP e telefone com regex e mensagens amigáveis em português
- `z.coerce.number()` para salário, com mínimo
- Data de nascimento: maior de 16 anos
- Senha e confirmação iguais (`refine` com `path`)
- Dependentes como `z.array(...)`

**`ValidationTsOnly.tsx`**
- Definir `interface Employee { ... age: number; salary: number }` à mão.
- Demonstrar **a ilusão do TypeScript**, com um botão para cada cenário:
  1. Um input digita `"abc"` no campo salário. O TypeScript diz que é `number`, mas o valor em runtime é string. Mostrar o resultado quebrado (`NaN`, ou `"1000" + 500 = "1000500"`).
  2. Simular resposta de uma API com `JSON.parse` + `as Employee` em um payload com campo faltando. Compila sem erro e **estoura em runtime** (`Cannot read properties of undefined`). Capturar o erro com try/catch e exibir na tela.
- Comentário no topo: o TypeScript some no navegador.

**`ValidationZod.tsx`**
- Os mesmos dois cenários, agora passando por `employeeSchema.safeParse(...)`. Mostrar na tela a lista de erros legíveis em vez do crash.
- Mostrar lado a lado: o tipo `Employee` vindo de `z.infer`, sem interface manual duplicada.

---

## 6. Demo 3: Context vs. Zustand

**Objetivo:** provar que um estado que muda toda hora **não deve** ficar em Context de nível alto, e que o Zustand com seletores resolve.

**Cenário:** um estado global com 3 campos: `theme`, `user` e `ticker`. O `ticker` é um número que **muda a cada 16 ms** (simulando cursor, relógio, preço em tempo real ou progresso). Existe uma grade de **N componentes** (slider de 50, 500, 2000) onde:
- A **maioria só precisa do `theme`**, e nunca usa o `ticker`.
- **Alguns poucos** precisam do `ticker` (um relógio e uma barra de progresso).

Controles: botão iniciar/pausar o ticker, slider de quantidade de componentes e um **input de texto** ao lado (para sentir o lag na digitação enquanto o ticker roda).

**`ContextBad.tsx` (RUIM)**
- Um único `AppContext` com `{ theme, user, ticker }`, provider no topo, valor em objeto único.
- O provider guarda o `ticker` em `useState` com `setInterval`.
- Todos os componentes que fazem `useContext(AppContext)` re-renderizam a cada tick, **mesmo os que só leem `theme`**.
- Cada componente da grade tem RenderCounter e um custo de render leve simulado. Resultado: contadores disparam em todos, FPS cai e o input trava com 500+ componentes.
- Comentar no topo por que isso acontece (qualquer mudança no valor re-renderiza todos os consumidores).

**`ZustandGood.tsx` (BOM)**
- Store com `create` do Zustand com os mesmos 3 campos e uma action `tick`.
- Cada componente assina **só o que usa** com seletor: `useStore(s => s.theme)`.
- Sem Provider.
- Resultado: apenas o relógio e a barra de progresso re-renderizam. Os contadores da grade ficam parados, FPS estável, input fluido.
- Deixar a store em ~15 linhas, pronta para virar print de slide.

**`index.tsx`:** aba para Context e aba para Zustand com **exatamente os mesmos controles**, para comparação justa. Uma linha de resumo abaixo: "Zustand para estado de UI. Dado de API vai para o TanStack Query."

---

## 7. Demo 4: Dados do servidor (Axios + TanStack Query vs. useEffect)

**API pública, sem chave:** `https://jsonplaceholder.typicode.com` (`/posts`, `/posts/:id`, `/users`, `/posts/:id/comments`). Observação: ela **aceita** POST/PUT/DELETE mas **não persiste** nada. Isso é esperado e deve ser explicado na interface.

**`api.ts`:** instância do Axios com `baseURL`, `timeout` e:
- **Request interceptor** que adiciona `Authorization: Bearer <token fake>` (pegar de uma variável em memória) e um **atraso artificial aleatório** (200 a 1500 ms) controlado por um switch, para provocar race conditions.
- **Response interceptor** com um `// TODO` ilustrativo do silent refresh em 401: se status 401, loga "chamaria /refresh-token e repetiria a requisição". Pode simular com um flag, já que a API não devolve 401 de verdade. Deixar o código curto e claro.

**`AxiosVsFetch.tsx`:** dois botões chamando `/posts/99999` (retorna 404).
- Com `fetch`: a Promise **resolve** e o dev precisa lembrar de checar `res.ok`. Mostrar na tela "sucesso" caso não cheque.
- Com `axios`: a Promise **rejeita** automaticamente, e cai no `catch`.
- Mostrar os dois resultados lado a lado.

**`UseEffectBad.tsx` (RUIM)**
- Lista de posts + painel de detalhes do post selecionado (com comentários).
- Três `useState` (`data`, `isLoading`, `isError`) + `useEffect` por requisição, tudo à mão.
- **Sem cleanup**: com o atraso aleatório ligado, clicar rápido entre posts mostra a resposta de um post antigo sobrescrevendo o atual (**race condition**). Exibir isso com um aviso visual do tipo "mostrando post 3, mas você clicou no 7".
- Navegar para outra aba e voltar: **refaz tudo e mostra loading de novo** (sem cache). Mostrar um contador de requisições disparadas.

**`UseQueryGood.tsx` (BOM)**
- Mesma tela com `useQuery` (`queryKey: ['posts']` e `['post', id]`) e funções vindas do `api.ts`.
- Mostrar: cache ao voltar para a aba (aparece instantâneo), `staleTime` configurável na interface, refetch ao focar a janela e indicador de `isFetching` (atualizando em segundo plano).
- Sem race condition (mesma situação de clicar rápido).
- Contador de requisições disparadas ao lado, para comparar com a versão ruim.
- Incluir o `ReactQueryDevtools`.

**`MutationDemo.tsx`**
- Formulário simples para criar um post (`POST /posts`) com `useMutation` mostrando `isPending`, `isSuccess` e `isError`.
- **Invalidação:** chamar `invalidateQueries({ queryKey: ['posts'] })` no `onSuccess`. Como a API não persiste, explicar na interface que a lista volta igual, e que o objetivo é mostrar o refetch acontecendo.
- **Atualização otimista:** exemplo de "curtir" um post com `onMutate` (atualiza o cache com `setQueryData`), `onError` (rollback) e `onSettled` (invalida). Incluir um **switch "forçar falha"** que faz a requisição falhar, para eu mostrar o rollback acontecendo ao vivo.

**`QueryClientProvider`** configurado em `main.tsx` ou `App.tsx`.

---

## 8. Demo 5: Gráficos (ApexCharts e ECharts)

**Objetivo:** snippets curtos, e uma comparação de performance entre SVG (Apex) e Canvas (ECharts).

**Dados:** um gerador local de série temporal (random walk) com `n` pontos. Controle com botões: **1.000**, **20.000**, **100.000** pontos. Mostrar o tempo de renderização (`performance.now()` antes de montar e depois do primeiro paint) e o FPS ao dar zoom ou passar o mouse.

Opcionalmente, incluir um segundo gráfico com dados reais da API pública do Open-Meteo, sem chave (`https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&hourly=temperature_2m`), buscando com **Axios + useQuery** e passando por uma função que formata a série. Isso mostra a conexão com o restante do stack.

**`ApexDemo.tsx`**
- `react-apexcharts` com um gráfico de **área com gradiente** e um **donut** (estilo painel executivo de SaaS: MRR, churn, vendas por canal).
- Configuração por props, visual bonito sem ajuste de CSS.
- Mostrar o que acontece com 20.000+ pontos (esperado: perda de performance, por ser SVG). Se travar demais a aba com 100.000 pontos, **limitar o botão com um aviso** em vez de travar o navegador.
- Comentário: poucos pontos, dado agregado, entrega rápida.

**`EchartsDemo.tsx`**
- `echarts` com `echarts-for-react` (ou um hook próprio de ~15 linhas, o que ficar mais limpo para slide).
- Gráfico de linha com `dataZoom` (slider + inside), `large: true` e `sampling: 'lttb'`, aguentando **100.000 pontos** fluido.
- Opcional, se sobrar tempo: um **heatmap** ou **candlestick** simples com dados gerados, para mostrar os recursos avançados.
- Comentário: Canvas, muito volume, objeto `option` mais verboso.

**`index.tsx`:** os dois gráficos lado a lado com o **mesmo dataset** e os mesmos botões de volume. Embaixo, uma mini tabela com tempo de renderização medido de cada um.

---

## 9. Ordem sugerida de trabalho

1. Configurar Tailwind, alias, shadcn, desligar StrictMode.
2. Criar `App.tsx` com as abas, `RenderCounter`, `FpsMeter` e `HeavyField`.
3. Demo 3 (estado). É a mais rápida e valida os utilitários.
4. Demo 2 (formulários). É a mais trabalhosa e a mais importante.
5. Demo 4 (dados).
6. Demo 1 (estilização).
7. Demo 5 (gráficos).
8. Revisão final contra o checklist abaixo.

## 10. Checklist de aceite

- [ ] `npm run dev` sobe sem erro e `npm run build` passa (`tsc` limpo).
- [ ] StrictMode desligado, com comentário explicando.
- [ ] FpsMeter visível em todas as abas.
- [ ] Formulário ruim: contador de renders sobe em **todos** os campos a cada tecla e o lag é perceptível.
- [ ] Formulário RHF: apenas o campo digitado (ou nenhum, no `register`) re-renderiza. Mesmo `HeavyField` nas três versões.
- [ ] Demo de validação mostra o crash/erro silencioso com TS puro e as mensagens do Zod.
- [ ] Context: com 500+ componentes e ticker ligado, o input trava. Zustand: fluido, com só os consumidores do `ticker` renderizando.
- [ ] useEffect: race condition reproduzível com o atraso ligado e sem cache ao voltar de aba. useQuery: cache, refetch ao focar e sem race condition.
- [ ] Mutação com invalidação e atualização otimista com rollback via switch "forçar falha".
- [ ] Gráficos: mesmo dataset nos dois, com tempo de renderização exibido para 1k, 20k e 100k pontos.
- [ ] Cada arquivo de demo tem o comentário "RUIM" ou "BOM" no topo.
- [ ] Um `README.md` curto na raiz explicando como rodar e o que cada aba mostra.
