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

**Bootstrap instalado via npm e servido localmente** (copiado para `assets/vendor/`) — sem CDN:
```
assets/vendor/bootstrap/bootstrap.min.css
assets/vendor/bootstrap/bootstrap.bundle.min.js
```

**APIs públicas utilizadas:**
- **ViaCEP** (`https://viacep.com.br`) — preenchimento automático de endereço via CEP
- **Open-Meteo** (`https://open-meteo.com`) — dados climáticos no dashboard

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

# 3. Abrir index.html com Live Server (VS Code)
#    ou abrir diretamente no navegador
```

> O Bootstrap é servido a partir de `assets/vendor/bootstrap/` (versionado para o GitHub Pages) — não requer conexão com CDN.

---

## Checklist | Indicadores de Desempenho (ID)

### RA1 — Framework CSS e layouts responsivos

- [x] ID 01 — Prototipa interfaces adaptáveis (mobile e desktop) — sidebar fixa no desktop, Offcanvas no mobile; breakpoints `col-md-*` / `col-lg-*`
- [x] ID 02 — Implementa layout responsivo com Framework CSS — Bootstrap 5.3 com grid de 12 colunas e utilitários `d-none d-lg-flex`, `d-lg-none`
- [x] ID 03 — Implementa layout responsivo com CSS puro — `@media (max-width: 991.98px)` definida no SCSS (`_layout.scss`, via o mixin `respond-below-lg`) para a sidebar e o `margin-left` do wrapper, compilada em `assets/css/style.css`
- [x] ID 04 — Utiliza componentes prontos de um Framework CSS:
  - **Recursos/componentes do Bootstrap:** sistema de **Grid** (12 colunas), classe base **`.card`** (KPI cards do `index.html`), classe base **`.table`** (tabela de estoque), classe base **`.btn`** (botões) e os componentes **JavaScript** **Offcanvas**, **Modal** e **Toast** (acionados por `data-bs-*` + `bootstrap.bundle.min.js`).
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
- [ ] ID 12 — Aplica expressões regulares (REGEX) — pendente
- [x] ID 13 — Utiliza elementos de seleção — `<select>` (categoria, fornecedor), `<input type="checkbox">` com `form-switch` (configurações), badges de status
- [ ] ID 14 — Implementa Web Storage — pendente

---

### RA3 — Ferramentas e boas práticas

- [x] ID 15 — Configura ambiente com Node.js e NPM — `package.json` com dependencies e scripts configurados
- [x] ID 16 — Utiliza boas práticas de versionamento no Git/GitHub — commits semânticos (`feat:`, `fix:`, `melhora`), repositório em `github.com/matheusbren/agrostock`
- [x] ID 17 — Mantém README.md padronizado — este documento
- [x] ID 18 — Organiza arquivos do projeto de forma modular — estrutura `assets/css/`, páginas HTML separadas por funcionalidade
- [x] ID 19 — Configura linters e formatadores — ESLint (`eslint.config.js`) + Prettier (`.prettierrc`) configurados

---

### RA4 — Bibliotecas JavaScript

- [ ] ID 20 — Utiliza jQuery para manipulação do DOM — jQuery instalado; pendente integração nas páginas
- [ ] ID 21 — Integra plugin jQuery — jQuery Mask Plugin instalado; pendente aplicação em campos de CEP/telefone

---

### RA5 — Requisições assíncronas para APIs

- [ ] ID 22 — Requisições para API fake (JSON Server) — JSON Server instalado; pendente criação do `db.json` e integração
- [ ] ID 23 — Exibição de dados da API fake — pendente (depende do ID 22)
- [x] ID 24 — Consumo de API pública — ViaCEP integrado via `fetch` no formulário de cadastro (preenchimento automático de endereço pelo CEP)

---

## Relatório de Auditoria

Disponível em [`relatorio-auditoria.html`](relatorio-auditoria.html) — contém análise dos 10 componentes Bootstrap, análise do sistema Grid/Flexbox e explicação técnica do rodapé fixo.

---

## Telas da Aplicação

### Teste de Responsividade — Desktop (lg · 1280px) vs Mobile (xs · 375px)

| Página | Desktop | Mobile |
|---|---|---|
| Dashboard | ![dashboard desktop](screenshots/dashboard-desktop.png) | ![dashboard mobile](screenshots/dashboard-mobile.png) |
| Estoque | ![estoque desktop](screenshots/estoque-desktop.png) | ![estoque mobile](screenshots/estoque-mobile.png) |
| Cadastro | ![cadastro desktop](screenshots/cadastro-desktop.png) | ![cadastro mobile](screenshots/cadastro-mobile.png) |
| Detalhes | ![detalhes desktop](screenshots/detalhes-desktop.png) | ![detalhes mobile](screenshots/detalhes-mobile.png) |
| Editar | ![editar desktop](screenshots/editar-desktop.png) | ![editar mobile](screenshots/editar-mobile.png) |
| Relatórios | ![relatorios desktop](screenshots/relatorios-desktop.png) | ![relatorios mobile](screenshots/relatorios-mobile.png) |
| Configurações | ![configuracoes desktop](screenshots/configuracoes-desktop.png) | ![configuracoes mobile](screenshots/configuracoes-mobile.png) |

### Relatório de Componentes, Grid/Flexbox e Sticky Footer

![relatorio auditoria](screenshots/relatorio-auditoria-desktop.png)
