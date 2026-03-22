# 🛠️ Especificação Técnica - AgroStock

## 📦 Modelo de Dados

```mermaid
erDiagram
    INSUMO {
        string id PK
        string nome
        string categoria
        number quantidade
        string unidade
        string fornecedor
        string cep
        string endereco
        string dataCompra
    }
