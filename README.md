# 🔨 FlashBid Monorepo | Lightning Auction Platform

O **FlashBid** é uma plataforma de leilões relâmpago de alta performance, desenvolvida utilizando uma arquitetura de **Monorepo** com **Bun Workspaces**. O projeto foi concebido para demonstrar excelência técnica em engenharia de software, desde o backend desacoplado até o frontend responsivo e tipado.

---

## 🏗️ Estrutura do Monorepo

O projeto utiliza o **Bun** como runtime e gerenciador de pacotes único, permitindo compartilhamento eficiente de tipos e dependências entre os serviços.

### 📦 Pacotes Principais:

#### [🚀 API (Backend)](./packages/api)
- **Tecnologias**: Bun, ElysiaJS, Drizzle ORM, InversifyJS, PostgreSQL.
- **Destaques**: Arquitetura modular, Injeção de Dependência, Testes Unitários e Binário Standalone.
- **Foco**: Alta performance e desacoplamento de provedores.

#### [💻 Web (Frontend)](./packages/web)
- **Tecnologias**: Next.js 15, TypeScript, Tailwind CSS.
- **Foco**: Interface moderna, UX fluida e integração total com a API.

---

## 🛠️ Tecnologias Compartilhadas

- **Gerenciador de Pacotes**: [Bun](https://bun.sh/)
- **Linter & Formatter**: [Biome](https://biomejs.dev/) (Rápido e unificado para todo o monorepo)
- **Testes**: [Vitest](https://vitest.dev/) (Execução paralela entre projetos)

---

## 📖 Documentação de Negócio

Para entender as histórias de usuário e os cenários de aceitação que guiam o desenvolvimento, acesse:
- [📄 BDD - Cenários de Aceitação](./BDD.md)

---

## 🚀 Como Executar o Projeto Completo

### 1. Pré-requisitos
Certifique-se de ter o **Bun** instalado em sua máquina.

### 2. Instalação de Dependências
Instalação centralizada de todos os pacotes:
```bash
bun install
```

### 3. Configuração de Infraestrutura
Suba o PostgreSQL e o Redis via Docker:
```bash
docker-compose -f packages/api/docker-compose.yml up -d
```

### 4. Execução em Desenvolvimento
Você pode rodar todos os serviços simultaneamente ou individualmente:

```bash
# Rodar tudo em paralelo (API + Web)
bun run dev --filter "*"

# Rodar apenas a API
bun run --filter api dev

# Rodar apenas o Web
bun run --filter web dev
```

---

## ✅ Comandos Úteis do Monorepo

```bash
# Rodar lint em todos os pacotes
bun run lint

# Rodar todos os testes (API e Web)
bun run test

# Corrigir formatação automaticamente
bun run lint:fix
```

---
*Este monorepo reflete a aplicação de padrões de nível enterprise em um ambiente moderno e extremamente rápido.*
