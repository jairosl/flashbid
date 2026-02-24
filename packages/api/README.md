# FlashBid API

API backend do FlashBid, plataforma focada em fluxos de produtos e leilões.

Este pacote entrega autenticação, contexto de usuário, operações de produto e storage de mídia, com arquitetura preparada para evoluir sem acoplamento excessivo.

## Overview
A API foi estruturada para resolver problemas de engenharia de software além da implementação de endpoints:

- isolar comportamento de negócio de framework/provedor
- reduzir acoplamento com serviços externos (auth/storage/database)
- permitir evolução incremental sem refatoração massiva

Para detalhes de camadas, contratos e convenções arquiteturais:

- [ARCHITECTURE.md](./ARCHITECTURE.md)

## Tech Stack

- Runtime: Bun
- Framework HTTP: Elysia
- Autenticação: Better Auth
- Banco de dados: PostgreSQL
- ORM: Drizzle ORM
- Storage de objetos: Supabase Storage
- Documentação de API: OpenAPI com `@elysiajs/openapi`
- Infra local: Docker Compose (PostgreSQL + Redis)

## Decisões de Engenharia (Alto Nível)

### 1. Desacoplamento de provedores por contrato
Problema:
Trocar provedor (por exemplo storage) pode causar refatoração em cadeia.

Solução:
Módulos usam contrato abstrato de service + implementação concreta + factory. O módulo `storage` é a referência atual.

### 2. Consistência e segurança na borda do sistema
Problema:
Validação inconsistente e erros não normalizados causam instabilidade em produção.

Solução:
Validação na borda via DTO/route, normalização de erros em camada compartilhada e contexto de autenticação resolvido por plugin/macro antes dos handlers protegidos.

### 3. Infra pronta para processamento assíncrono
Problema:
Parte dos workloads tende a ser assíncrona (notificações, pós-processamento, jobs).

Solução:
A infra local já provisiona Redis para suportar workloads com fila na evolução da aplicação, sem quebrar contratos HTTP atuais.

## Módulos Atuais

- `auth`: integração Better Auth e endpoints de autenticação
- `users`: dados do usuário autenticado
- `products`: criação de produto (em evolução)
- `storage`: upload/remoção de imagem com validação de ownership

## Como Rodar

### Pré-requisitos

- Bun instalado
- Docker + Docker Compose instalados

### 1. Instalar dependências

```bash
bun install
```

### 2. Configurar ambiente

```bash
cp .env.example .env
```

Preencha as variáveis obrigatórias no `.env` (database, auth e storage).

### 3. Subir infraestrutura

```bash
docker-compose up -d
```

Serviços locais:

- PostgreSQL em `localhost:5434`
- Redis em `localhost:6378`

### 4. Executar migrações

```bash
bun run db:generate
bun run db:migrate
```

### 5. Iniciar API

```bash
bun run dev
```

URL padrão: `http://localhost:8080`

## Documentação e Exploração da API

- OpenAPI UI: `http://localhost:8080/openapi`
- Exemplos HTTP:
  - `docs/http/auth.http`
  - `docs/http/storage.http`
- Variáveis do HTTP Client:
  - `docs/http-client.env.json`

## Scripts Úteis

```bash
bun run dev
bun run build
bun run build:prod
bun run db:generate
bun run db:migrate
bun run db:studio
```

## Evolução Técnica

- A arquitetura é incremental: manter simples onde ainda é simples.
- Com aumento de complexidade, a base permite evoluir para use-cases explícitos, workers com fila e observabilidade mais forte.
- O foco é decisão de engenharia sustentável, não acoplamento ao framework.
