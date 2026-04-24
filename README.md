# AgroStock

**Autor:** Matheus de Queiroga Bren

Sistema web responsivo para controle de insumos agrícolas. Permite cadastrar, visualizar e gerenciar produtos como fertilizantes, sementes e defensivos, com controle de estoque e organização de informações.

---

## Design

Prototipação: https://www.figma.com/design/hK4haiiVzRuvn8zxy3sQ3N/AgroStock?node-id=0-1&t=cqMSHli0yGXrTOrf-1

---

## Site em Produção

Em andamento — aguardando configuração do GitHub Pages.

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

**Bootstrap referenciado via npm local** — sem CDN:
```
node_modules/bootstrap/dist/css/bootstrap.min.css
node_modules/bootstrap/dist/js/bootstrap.bundle.min.js
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

> O Bootstrap é servido a partir de `node_modules/` — não requer conexão com CDN.

---

## Checklist | Indicadores de Desempenho (ID)

### RA1 — Framework CSS e layouts responsivos

- [x] ID 01 — Prototipa interfaces adaptáveis (mobile e desktop) — sidebar fixa no desktop, Offcanvas no mobile; breakpoints `col-md-*` / `col-lg-*`
- [x] ID 02 — Implementa layout responsivo com Framework CSS — Bootstrap 5.3 com grid de 12 colunas e utilitários `d-none d-lg-flex`, `d-lg-none`
- [x] ID 03 — Implementa layout responsivo com CSS puro — `assets/css/custom.css` com `@media (max-width: 991.98px)` para sidebar e margin-left do wrapper
- [x] ID 04 — Utiliza componentes prontos de um Framework CSS — 10 componentes Bootstrap: Offcanvas, Toast, Modal, Badge, Table, Progress, Form, Form Switch, Button, Pagination
- [x] ID 05 — Cria layout fluido usando unidades relativas — `rem`, `%`, `vh`, `vw` em todo o `custom.css`
- [x] ID 06 — Aplica um Design System consistente — CSS variables (`:root`) com paleta Material Design 3 e tokens semânticos (`--agro-primary`, `--agro-error`, etc.)
- [ ] ID 07 — Utiliza Sass (SCSS) — Sass instalado (`devDependencies`); pendente migração do `custom.css` para SCSS
- [x] ID 08 — Aplica tipografia responsiva — escala tipográfica com `rem` e `clamp`; fonte `Nunito` via Google Fonts
- [ ] ID 09 — Aplica técnicas de responsividade de imagens — pendente
- [ ] ID 10 — Otimiza imagens — pendente

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
- [x] ID 19 — Configura linters e formatadores — ESLint + Prettier em `devDependencies`

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
