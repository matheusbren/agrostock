# 📄 Product Requirements Document (PRD) - AgroStock

## 1. Visão Geral e Objetivo

O AgroStock é uma aplicação web responsiva que permite ao usuário gerenciar insumos agrícolas de forma simples e eficiente. A aplicação possibilita o cadastro, visualização e controle de produtos como fertilizantes, sementes e defensivos, organizando o estoque e facilitando a tomada de decisões.

O diferencial: Fornecer uma visão clara e organizada dos insumos disponíveis, permitindo melhor controle do estoque agrícola através de uma interface intuitiva, responsiva e de fácil utilização.

---

## 2. Atores do Sistema

**Visitante:** Usuário que acessa a aplicação e pode visualizar os insumos cadastrados.

**Usuário:** Pode cadastrar, editar e excluir insumos agrícolas.

**O Sistema:** Responsável por validar dados, armazenar informações (localStorage/API) e garantir o funcionamento correto das operações.

---

## 3. Histórias de Usuário e Escopo

Abaixo estão as funcionalidades principais do sistema.

---

### 🌱 Épico 1: Cadastro de Insumos

**US01 - Cadastro de Insumo:**  
Como um Usuário, quero cadastrar um novo insumo informando nome, categoria, quantidade e fornecedor, para manter o controle do estoque.

**Critérios de Aceitação:**
- Todos os campos obrigatórios devem ser preenchidos.
- A quantidade deve ser um número positivo.
- O insumo deve ser salvo no sistema (localStorage ou API).
- O sistema deve exibir mensagem de sucesso ao cadastrar.

---

### 📋 Épico 2: Listagem e Visualização

**US02 - Visualizar Lista de Insumos:**  
Como um Usuário, quero visualizar todos os insumos cadastrados em formato de tabela ou cards, para acompanhar o estoque.

**Critérios de Aceitação:**
- A lista deve exibir nome, categoria e quantidade.
- Os dados devem ser organizados de forma clara.
- Deve funcionar em diferentes tamanhos de tela (responsivo).

---

### ✏️ Épico 3: Edição e Exclusão

**US03 - Editar Insumo:**  
Como um Usuário, quero editar as informações de um insumo, para manter os dados atualizados.

**Critérios de Aceitação:**
- O sistema deve permitir alterar os dados existentes.
- Os dados atualizados devem ser salvos corretamente.
- Deve exibir confirmação de sucesso.

---

**US04 - Excluir Insumo:**  
Como um Usuário, quero excluir um insumo, para remover itens que não são mais utilizados.

**Critérios de Aceitação:**
- Deve haver confirmação antes da exclusão.
- O item deve ser removido da lista.
- A interface deve ser atualizada automaticamente.

---

### 🌐 Épico 4: Integração com API

**US05 - Buscar Endereço pelo CEP:**  
Como um Usuário, quero informar o CEP do fornecedor e ter o endereço preenchido automaticamente, para facilitar o cadastro.

**Critérios de Aceitação:**
- O sistema deve consumir uma API pública (ViaCEP).
- O endereço deve ser preenchido automaticamente.
- Deve tratar erros (CEP inválido).

---

## 4. Requisitos Funcionais

**Validação de Dados:**
- Campos obrigatórios devem ser validados.
- Quantidade deve ser número positivo.
- CEP deve ser validado.

**Persistência de Dados:**
- Dados armazenados no localStorage e/ou API fake (JSON Server).
- Dados devem permanecer após recarregar a página.

**Responsividade:**
- Interface deve funcionar em mobile e desktop.
- Uso de framework CSS (Bootstrap ou similar).

---

## 5. Requisitos Não-Funcionais

**Performance:**
- Aplicação deve carregar rapidamente (menos de 3 segundos).

**Usabilidade:**
- Interface simples e intuitiva.
- Navegação clara entre páginas.

**Compatibilidade:**
- Funcionar em navegadores modernos (Chrome, Edge, Firefox).

---

## 6. Design e Layout

**Página Inicial:**
- Lista de insumos cadastrados.

**Formulário de Cadastro:**
- Campos para cadastro com validação.

**Página de Detalhes:**
- Informações completas do insumo.

**Menu de Navegação:**
- Links para páginas principais (Home, Cadastro).

---

## 7. MVP - Escopo Mínimo

✅ Cadastro de insumos  
✅ Listagem de insumos  
✅ Edição de insumos  
✅ Exclusão de insumos  
✅ Validação de formulário  
✅ Persistência de dados  
✅ Integração com API  

---

## 8. Critérios de Aceitação Gerais

- Formulários devem ter validação e feedback.
- Layout deve ser responsivo.
- Dados devem ser persistidos corretamente.
- Integração com API deve funcionar corretamente.
