# 🚀 FlashBid API

API REST construída com **Elysia.js** + **Bun** para o sistema de leilões FlashBid.

## 📚 Documentação Completa

Para documentação detalhada sobre arquitetura, padrões e boas práticas, consulte:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Documentação completa da arquitetura

## 🎯 Stack Tecnológica

- **Runtime**: Bun
- **Framework**: Elysia.js
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Auth**: Better Auth
- **Documentation**: OpenAPI/Swagger

## 📁 Estrutura do Projeto

```
src/
├── config/              # Configurações centralizadas (CORS, OpenAPI)
├── lib/                 # Bibliotecas compartilhadas
│   ├── database/        # Drizzle ORM + Schemas
│   └── http/            # Plugins Elysia
├── modules/             # Módulos de domínio (DDD)
│   ├── auth/            # Autenticação (Better Auth)
│   ├── storage/         # Upload de arquivos (Supabase)
│   ├── users/           # Gestão de usuários
│   ├── products/        # Gestão de produtos
│   └── common/          # Tipos/erros/constantes compartilhados
│       ├── errors/
│       ├── types/
│       └── constants/
```

## 🚀 Quick Start

### 1. Instalar dependências

```bash
bun install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Iniciar banco de dados (Docker)

```bash
docker-compose up -d
```

### 4. Executar migrations

```bash
bun run db:generate
bun run db:migrate
```

### 5. Iniciar servidor de desenvolvimento

```bash
bun run dev
```

A API estará disponível em `http://localhost:8080`

## 📝 Scripts Disponíveis

```bash
bun run dev           # Inicia servidor em modo watch
bun run db:generate   # Gera migrations do Drizzle
bun run db:migrate    # Executa migrations
bun run db:studio     # Abre Drizzle Studio (GUI do banco)
```

## 📖 Documentação da API

Acesse a documentação interativa (Swagger):

- **Swagger UI**: `http://localhost:8080/openapi`

## 🏗️ Padrões de Organização

### Estrutura de um Módulo

Cada módulo segue um padrão com subpastas organizadas (algumas são opcionais):

```
module-name/
├── client/                     # Clientes externos (opcional)
│   └── index.ts
├── dto/                        # Validações Elysia (opcional)
│   └── index.ts
├── services/                   # Lógica de negócio (opcional)
│   ├── {module}.service.ts     # Abstract class
│   ├── {module}-impl.service.ts  # Implementação
│   └── index.ts                # Factory
├── controllers/                # Handlers HTTP (opcional)
│   └── index.ts
├── routes/                     # Definição de rotas
│   └── index.ts
├── types/                      # Tipos TypeScript (opcional)
│   └── index.ts
└── index.ts                    # Exports públicos
```

### Camadas da Aplicação

```
Routes → DTOs → Controllers → Services (Abstract) → Implementation → Database/Client

Obs.: o módulo de Auth é uma exceção, pois o Better Auth expõe as rotas principais via plugin. Mantemos `client/`, `controllers/` e `routes/` para endpoints auxiliares e organização.
```

### Princípios

- ✅ **Abstract Classes**: Services são abstratos para fácil troca de implementação
- ✅ **DTOs**: Validação separada usando Elysia Type System
- ✅ **Erros Centralizados**: Classes de erro em `modules/common/errors/`
- ✅ **Error Handling Global**: Plugin Elysia em `lib/http/plugins/error.ts`
- ✅ **Factory Pattern**: Funções `create*Service()` para instanciar services
- ✅ **Barrel Exports**: Apenas API pública exportada via `index.ts`

## 🔐 Autenticação

A API usa **Better Auth** para autenticação. As rotas principais são expostas automaticamente via plugin com base em `basePath: /auth`.

Endpoints adicionais desta API:
- `GET /auth/session` - Retorna a sessão atual (helper)

## 🗄️ Database

### Schemas Principais

- **user**: Usuários do sistema
- **product**: Produtos para leilão
- **auction**: Leilões ativos/finalizados
- **bid**: Lances em leilões

### Gerenciar Database

```bash
# Gerar nova migration após alterar schema
bun run db:generate

# Aplicar migrations
bun run db:migrate

# Abrir interface visual do banco
bun run db:studio
```

## 🔧 Desenvolvimento

### Adicionar Novo Módulo

1. Criar estrutura de pastas:
   ```bash
   mkdir -p src/modules/nome-modulo/{dto,services,controllers,routes,types}
   ```

2. Criar arquivos seguindo o padrão:
   - `types/index.ts` - Interfaces do domínio
   - `dto/index.ts` - Validações Elysia
   - `services/{module}.service.ts` - Abstract class
   - `services/{module}-db.service.ts` - Implementação
   - `services/index.ts` - Factory
   - `controllers/index.ts` - Handlers HTTP
   - `routes/index.ts` - Rotas
   - `index.ts` - Exports públicos

3. Registrar rotas em `src/index.ts`

Exemplo completo em [ARCHITECTURE.md](./ARCHITECTURE.md#-como-adicionar-um-novo-módulo)

## 📦 Módulos Existentes

### Auth (`/auth/*`)

- Autenticação via Better Auth (rotas principais expostas pelo plugin)
- `GET /auth/session` - Sessão atual (rota auxiliar)

### Storage (`/upload/*`)

Upload de arquivos usando Supabase Storage com abstração completa.

- `POST /upload` - Upload de arquivo (autenticado)
- `DELETE /upload/:path` - Deletar arquivo (autenticado)

**Exemplo de troca de implementação:**
```typescript
// Trocar de Supabase para S3 facilmente
export const createStorageService = () => {
  if (process.env.STORAGE_PROVIDER === 's3') {
    return new S3StorageService();
  }
  return new SupabaseStorageService();
};
```

### Users (`/users/*`)

Gestão de usuários com service abstrato.

- `GET /users/` - Dados do usuário autenticado

### Products (`/products/*`)

Gestão de produtos para leilão.

- `POST /products/` - Criar produto (autenticado)

## 🌐 CORS

Configurado para aceitar requisições de:

- `http://localhost:3000` (Frontend)

Edite em `src/config/cors.ts` para adicionar outras origens.

## 📚 Recursos

- [Elysia.js Docs](https://elysiajs.com)
- [Better Auth Docs](https://better-auth.com)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Bun Docs](https://bun.sh)

---
