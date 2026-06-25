# AgroStock

**Autor:** Matheus de Queiroga Bren

Sistema web responsivo para controle de insumos agrícolas. Permite cadastrar, visualizar e gerenciar produtos como fertilizantes, sementes e defensivos, com controle de estoque e organização de informações.

---

## Design

Prototipação: https://www.figma.com/proto/E3N80a6McIR1wdHOAizz1i/AgroStock?node-id=1-1584&p=f&t=nNHJb7IyxmF0cUU9-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A1584&show-proto-sidebar=1

---

## Site em Produção

https://matheusbren.github.io/agrostock/

---

## Tecnologias e Dependências

| Pacote | Versão | Uso |
|---|---|---|
| `bootstrap` | ^5.3.8 | Framework CSS + componentes JS |
| `jquery` | ^3.7.1 | Manipulação do DOM |
| `jquery-mask-plugin` | ^1.14.16 | Máscaras em campos de formulário |
| `json-server` | ^1.0.0-beta.3 | API REST fake (dev) |
| `eslint` | ^9.39.4 | Linter JavaScript |
| `prettier` | ^3.8.2 | Formatador de código |
| `sass` | ^1.99.0 | Pré-processador CSS |

**Bibliotecas instaladas via npm e servidas localmente** (copiadas para `assets/vendor/`) — sem CDN:
```
assets/vendor/bootstrap/bootstrap.min.css
assets/vendor/bootstrap/bootstrap.bundle.min.js
assets/vendor/jquery/jquery.min.js
assets/vendor/jquery/jquery.mask.min.js
```

> Bootstrap, jQuery e jQuery Mask Plugin são versionados em `assets/vendor/` e referenciados por caminho relativo (funciona no GitHub Pages sem conexão a CDN). As **fontes** (Manrope, Inter) e os **ícones** (Material Symbols) são a única dependência externa de front-end: carregados do Google Fonts via `@import` em `assets/scss/_base.scss`.

**APIs públicas utilizadas** (consumidas em `assets/js/public-apis.js` com `fetch` + `async/await`):
- **ViaCEP** (`https://viacep.com.br/ws/{cep}/json/`) — preenche endereço (rua, cidade, UF) a partir do CEP no cadastro/edição de insumo; trata CEP inválido/não encontrado com toast.
- **Open-Meteo** (`https://api.open-meteo.com/v1/forecast`) — temperatura e condição atual no card de clima do dashboard; falha de rede degrada para um texto neutro, sem quebrar o layout.

---

## Páginas do sistema

| Arquivo | Página |
|---|---|
| `index.html` | Dashboard — Painel de Controle |
| `estoque.html` | Gestão de Estoque |
| `cadastro.html` | Cadastro de Insumo |
| `detalhes.html` | Detalhes do Produto |
| `editar.html` | Edição de Insumo |
| `relatorios.html` | Relatórios e Histórico |
| `configuracoes.html` | Configurações do Sistema |

---

## Manual de Execução

```bash
# 1. Clonar o repositório
git clone https://github.com/matheusbren/agrostock.git
cd agrostock

# 2. Instalar dependências
npm install

# 3. Compilar o CSS a partir do SCSS
npm run sass:build       # ou `npm run sass:watch` para recompilar ao salvar

# 4. (Opcional — desenvolvimento) Subir a API fake em http://localhost:3000
npm run json:server      # serve db.json com GET/POST/PUT/DELETE em /insumos

# 5. Abrir index.html com Live Server (VS Code) ou diretamente no navegador
```

> **Fonte de dados (localhost × produção):** o JSON Server roda **apenas em `localhost`** — `assets/js/config.js` detecta o hostname e liga a flag `usarJsonServer`. No GitHub Pages (ou em qualquer host que não seja `localhost`/`127.0.0.1`) a aplicação usa automaticamente o **`localStorage`** do navegador como fonte de dados, então o site funciona hospedado de forma estática, sem servidor.

---

## Checklist | Indicadores de Desempenho (ID)

### RA1 — Framework CSS e layouts responsivos

- [x] ID 01 — Prototipa interfaces adaptáveis (mobile e desktop) — sidebar fixa no desktop, Offcanvas no mobile; breakpoints `col-md-*` / `col-lg-*`
- [x] ID 02 — Implementa layout responsivo com Framework CSS — Bootstrap 5.3 com grid de 12 colunas e utilitários `d-none d-lg-flex`, `d-lg-none`
- [x] ID 03 — Implementa layout responsivo com CSS puro — `@media (max-width: 991.98px)` definida no SCSS (`_layout.scss`, via o mixin `respond-below-lg`) para a sidebar e o `margin-left` do wrapper, compilada em `assets/css/style.css`
- [x] ID 04 — Utiliza componentes prontos de um Framework CSS:
  - **Recursos/componentes do Bootstrap:** sistema de **Grid** (12 colunas), classe base **`.card`** (KPI cards do `index.html`), classe base **`.table`** (tabela de estoque), classe base **`.btn`** (botões), **Form Switch** (`form-check form-switch`) e os componentes **JavaScript** **Offcanvas**, **Modal** e **Toast** (acionados por `data-bs-*` + `bootstrap.bundle.min.js`).
  - **Estilização própria sobre a estrutura (não são componentes do Bootstrap):** badge (`.badge-status`), progress (`.progress-agro`), paginação (`.pagination-agro`) e campos de formulário (`.form-control-agro` / `.form-select-agro`).
- [x] ID 05 — Cria layout fluido usando unidades relativas — `rem`, `%`, `vh`, `vw` usadas no SCSS (`_base.scss`, `_layout.scss`, `main.scss`) e compiladas em `assets/css/style.css`
- [x] ID 06 — Aplica um Design System consistente — CSS variables (`:root`) com paleta Material Design 3 e tokens semânticos (`--agro-primary`, `--agro-error`, etc.)
- [x] ID 07 — Utiliza Sass (SCSS) — `_variables.scss`, `_mixins.scss`, `_base.scss`, `_layout.scss` com variáveis, mixins e partials compilados via `npm run sass:build`
- [x] ID 08 — Aplica tipografia responsiva — `clamp()` em h1–h4 (`_base.scss`) + escala em `rem`; fontes `Manrope` e `Inter` via Google Fonts
- [x] ID 09 — Aplica técnicas de responsividade de imagens — `<picture>` com `srcset`/`sizes` em `detalhes.html`, servido dentro de `.img-cover-container` + `.img-product-thumb` (com `object-fit: cover` e `aspect-ratio`, definidos em `main.scss`); avatares de interface também usam dimensionamento por parâmetro de URL
- [x] ID 10 — Otimiza imagens — formato **WebP** com fallback JPG via `<picture>` + `srcset` (400w/800w) e `loading="lazy"`/`decoding="async"` em `detalhes.html` (imagens geradas com `sharp`); carregamento adaptativo dos avatares por parâmetro de URL (`size=`)

---

### RA2 — Tratamento de formulários e validações

- [x] ID 11 — Implementa validação HTML nativa — atributos `required` nos campos obrigatórios de `cadastro.html` e `editar.html`
- [x] ID 12 — Aplica expressões regulares (REGEX) — funções puras em `assets/js/validators.js` (`validarNomeInsumo`, `validarQuantidade`, `validarEmail`, `validarTelefone`, `validarCEP`), com a regex comentada acima de cada uma; aplicadas no submit de `page-cadastro.js`, `page-editar.js` e `page-configuracoes.js` com feedback inline (`aplicarFeedback`)
- [x] ID 13 — Utiliza elementos de seleção — `<select>` (categoria, fornecedor), `<input type="checkbox">` com `form-switch` (configurações), badges de status
- [x] ID 14 — Implementa Web Storage — `assets/js/storage.js` encapsula o `localStorage` (chaves `agrostock:insumos` e `agrostock:preferencias`, com seed inicial em `semear()`); os insumos persistem por aqui como fallback de `api.js` e as preferências de `configuracoes.html` são lidas/gravadas em `page-configuracoes.js` (sobrevivem ao reload)

---

### RA3 — Ferramentas e boas práticas

- [x] ID 15 — Configura ambiente com Node.js e NPM — `package.json` com dependencies e scripts configurados
- [x] ID 16 — Utiliza boas práticas de versionamento no Git/GitHub — commits semânticos (`feat:`, `fix:`, `melhora`), repositório em `github.com/matheusbren/agrostock`
- [x] ID 17 — Mantém README.md padronizado — este documento
- [x] ID 18 — Organiza arquivos do projeto de forma modular — estrutura `assets/css/`, páginas HTML separadas por funcionalidade
- [x] ID 19 — Configura linters e formatadores — ESLint (`eslint.config.js`) + Prettier (`.prettierrc`) configurados

---

### RA4 — Bibliotecas JavaScript

- [x] ID 20 — Utiliza jQuery para manipulação do DOM — render dinâmico da tabela, busca, filtros por categoria e exclusão animada (`fadeIn`/`fadeOut`) em `assets/js/page-estoque.js`; helper `mostrarToast` em `app.js`; também usado em `page-detalhes.js`, `page-editar.js`, `page-configuracoes.js` e `page-dashboard.js`
- [x] ID 21 — Integra plugin jQuery — jQuery Mask Plugin aplicado em `assets/js/app.js` (linhas 67–78): máscara `00000-000` no `#cep` (cadastro/edição) e `(00) 00000-0000` no `#telefone` (configurações)

---

### RA5 — Requisições assíncronas para APIs

- [x] ID 22 — Requisições para API fake (JSON Server) — `assets/js/api.js` faz `fetch` GET/POST/PUT/DELETE em `/insumos` quando em `localhost` (`db.json` via `npm run json:server`), com fallback para `localStorage` em produção — mesma assinatura nos dois ambientes (`window.AgroApi`)
- [x] ID 23 — Exibição de dados da API fake — `page-estoque.js` renderiza a tabela a partir de `AgroApi.listarInsumos()`; `page-detalhes.js` exibe um insumo por `?id=`; `page-editar.js` preenche o formulário; `page-dashboard.js` calcula o KPI de estoque baixo
- [x] ID 24 — Consumo de API pública — `assets/js/public-apis.js` (`fetch` + `async/await`): **ViaCEP** preenche o endereço pelo CEP no cadastro/edição e **Open-Meteo** alimenta o card de clima do dashboard (`page-dashboard.js`), com tratamento de erro que não quebra o layout

---

## Relatório de Auditoria

Disponível em [`relatorio-auditoria.html`](relatorio-auditoria.html) — contém análise dos componentes de interface (Bootstrap nativos + customizados), análise do sistema Grid/Flexbox e explicação técnica do rodapé fixo.
