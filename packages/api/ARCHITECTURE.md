# 🏗️ Arquitetura da API - FlashBid

## 📋 Visão Geral

Esta API foi construída com **Elysia.js** + **Bun**, seguindo princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, com foco em escalabilidade, manutenibilidade e organização modular.

## 🎯 Stack Tecnológica

- **Runtime**: Bun
- **Framework**: Elysia.js
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Auth**: Better Auth
- **Validation**: Elysia Type System
- **Documentation**: OpenAPI/Swagger

---

## 📁 Estrutura de Pastas

```
packages/api/
├── src/
│   ├── index.ts                          # Entry point da aplicação
│   │
│   ├── config/                           # ⚙️ Configurações centralizadas
│   │   ├── index.ts                      # Barrel export
│   │   ├── cors.ts                       # Configuração CORS
│   │   └── openapi.ts                    # Configuração OpenAPI/Swagger
│   │
│   ├── lib/                              # 🔧 Bibliotecas e utilitários compartilhados
│   │   ├── database/
│   │   │   └── drizzle/
│   │   │       ├── client.ts             # Cliente Drizzle
│   │   │       ├── schema/               # Schemas do banco de dados
│   │   │       │   ├── index.ts
│   │   │       │   ├── users.ts
│   │   │       │   ├── accounts.ts
│   │   │       │   ├── sessions.ts
│   │   │       │   ├── verifications.ts
│   │   │       │   ├── products.ts
│   │   │       │   ├── auctions.ts
│   │   │       │   └── bids.ts
│   │   │       └── migrations/           # Migrações do banco
│   │   │
│   │   └── http/
│   │       └── plugins/                  # Plugins Elysia
│   │           ├── index.ts
│   │           ├── auth.ts               # Plugin de autenticação
│   │           └── error.ts              # Error handling global
│   │
│   ├── modules/                          # 📦 Módulos de domínio (DDD)
│   │   ├── auth/                         # Módulo de autenticação
│   │   │   ├── client/                   # Cliente Better Auth
│   │   │   │   ├── index.ts
│   │   │   │   └── better-auth.client.ts
│   │   │   ├── controllers/              # Handlers auxiliares
│   │   │   │   └── index.ts
│   │   │   ├── routes/                   # Rotas auxiliares
│   │   │   │   └── index.ts
│   │   │   ├── docs.ts                   # Documentação OpenAPI
│   │   │   ├── auth.routes.ts            # (legacy) compat
│   │   │   └── index.ts
│   │   │
│   │   ├── storage/                      # Módulo de storage (Supabase)
│   │   │   ├── client/                   # Clientes externos
│   │   │   │   ├── index.ts
│   │   │   │   └── supabase.client.ts
│   │   │   ├── dto/                      # Validações Elysia
│   │   │   │   └── index.ts
│   │   │   ├── services/                 # Lógica de negócio
│   │   │   │   ├── index.ts
│   │   │   │   ├── storage.service.ts    # Abstract class
│   │   │   │   └── supabase-storage.service.ts  # Implementação
│   │   │   ├── controllers/              # Handlers HTTP
│   │   │   │   └── index.ts
│   │   │   ├── routes/                   # Definição de rotas
│   │   │   │   └── index.ts
│   │   │   ├── types/                    # Tipos específicos
│   │   │   │   └── index.ts
│   │   │   └── index.ts                  # Exports públicos
│   │   │
│   │   ├── users/                        # Módulo de usuários
│   │   │   ├── dto/
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── index.ts
│   │   │   │   ├── users.service.ts      # Abstract class
│   │   │   │   └── users-db.service.ts   # Implementação
│   │   │   ├── controllers/
│   │   │   │   └── index.ts
│   │   │   ├── routes/
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── products/                     # Módulo de produtos
│   │       ├── dto/
│   │       │   └── index.ts
│   │       ├── services/
│   │       │   ├── index.ts
│   │       │   ├── products.service.ts   # Abstract class
│   │       │   └── products-db.service.ts  # Implementação
│   │       ├── controllers/
│   │       │   └── index.ts
│   │       ├── routes/
│   │       │   └── index.ts
│   │       ├── types/
│   │       │   └── index.ts
│   │       └── index.ts
│   │
│   │   └── common/                        # 🌐 Código compartilhado entre módulos
│   │       ├── errors/                    # Classes de erro customizadas
│   │       │   ├── index.ts
│   │       │   ├── app-error.ts           # Classe base
│   │       │   ├── storage-error.ts
│   │       │   ├── validation-error.ts
│   │       │   ├── not-found-error.ts
│   │       │   └── unauthorized-error.ts
│   │       ├── types/                     # Tipos TypeScript globais
│   │       │   └── index.ts
│   │       └── constants/                 # Constantes da aplicação
│   │           └── index.ts
│
├── tests/                                # 🧪 Testes (estrutura futura)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example                          # Exemplo de variáveis de ambiente
├── drizzle.config.ts                     # Configuração Drizzle Kit
├── tsconfig.json                         # Configuração TypeScript
├── package.json                          # Dependências e scripts
└── docker-compose.yml                    # Serviços (PostgreSQL, Redis)
```

---

## 🎨 Padrões de Organização

### 1. **Separação por Módulos de Domínio**

Cada módulo representa um domínio de negócio e contém toda a lógica relacionada:

```
modules/
├── auth/          # Autenticação e autorização
├── storage/       # Upload de arquivos
├── users/         # Gestão de usuários
├── products/      # Gestão de produtos
└── common/        # Tipos/erros/constantes compartilhados
```

### 2. **Estrutura de um Módulo**

Cada módulo segue uma estrutura consistente com subpastas organizadas por responsabilidade:

```
module-name/
├── client/                     # Clientes externos (APIs, SDKs) - OPCIONAL
│   ├── index.ts
│   └── *.client.ts
├── dto/                        # Validações Elysia (Data Transfer Objects) - OPCIONAL
│   └── index.ts
├── services/                   # Lógica de negócio - OPCIONAL
│   ├── index.ts                # Factory + exports
│   ├── {module}.service.ts     # Abstract class (interface)
│   └── {module}-impl.service.ts  # Implementação concreta
├── controllers/                # Handlers HTTP - OPCIONAL
│   └── index.ts
├── routes/                     # Definição de rotas
│   └── index.ts
├── types/                      # Tipos TypeScript específicos - OPCIONAL
│   └── index.ts
└── index.ts                    # Exports públicos (API do módulo)
```

**Princípios:**
- ✅ **client/**: Apenas para módulos que precisam de clientes externos (ex: Supabase, AWS S3)
- ✅ **dto/**: Validações usando Elysia Type System (`t.Object`, `t.String`, etc)
- ✅ **services/**: Abstract classes para permitir troca de implementação
- ✅ **controllers/**: Apenas lida com HTTP (request/response)
- ✅ **routes/**: Define endpoints, middlewares e documentação OpenAPI
- ✅ **types/**: Interfaces e tipos específicos do domínio
- ✅ **index.ts**: Exporta apenas API pública (types, services, routes)

Obs.: o módulo de Auth é uma exceção, pois o Better Auth expõe as rotas principais via plugin. Mantemos `client/`, `controllers/` e `routes/` para endpoints auxiliares e organização.

### 3. **Camadas da Aplicação**

```
┌─────────────────────────────────────┐
│         HTTP Request                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Routes Layer                │  ← Define endpoints, middlewares, DTOs
│      (routes/index.ts)              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          DTO Layer                  │  ← Validação de entrada (Elysia)
│      (dto/index.ts)                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Controller Layer               │  ← Orquestra request/response
│      (controllers/index.ts)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Service Layer                 │  ← Lógica de negócio (Abstract)
│      (services/*.service.ts)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Implementation Layer             │  ← Implementação concreta
│  (services/*-impl.service.ts)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Database/Client Layer             │  ← Drizzle ORM / Supabase / etc
│  (lib/database ou client/)          │
└─────────────────────────────────────┘
```

---

## 🔑 Princípios e Boas Práticas

### **1. Single Responsibility Principle (SRP)**
- Cada arquivo/pasta tem uma única responsabilidade
- **DTOs**: Apenas validação de dados
- **Controllers**: Apenas orquestração HTTP
- **Services**: Apenas lógica de negócio
- **Routes**: Apenas definição de endpoints

### **2. Abstract Classes para Abstração**
- Services são **abstract classes** (não interfaces)
- Permite trocar implementação facilmente (ex: Supabase → S3)
- Factory pattern para instanciar services
- Exemplo:
  ```typescript
  // Abstract
  export abstract class StorageService {
    abstract uploadFile(file: File): Promise<UploadResult>;
  }

  // Implementação
  export class SupabaseStorageService extends StorageService {
    async uploadFile(file: File) { /* ... */ }
  }

  // Factory
  export const createStorageService = () => new SupabaseStorageService();
  ```

### **3. DTOs com Elysia Type System**
- Validação declarativa usando `t.Object`, `t.String`, etc
- DTOs separados em `dto/index.ts`
- Controllers **NÃO** fazem validação manual
- Exemplo:
  ```typescript
  export const uploadFileDto = t.Object({
    file: t.File({ maxSize: 10 * 1024 * 1024 }),
    folder: t.Optional(t.String()),
  });
  ```

### **4. Erros Centralizados**
- Todas as classes de erro genéricas em `modules/common/errors/`
- Cada módulo pode ter erros específicos em `modules/<mod>/errors`
- Hierarquia: `AppError` → `StorageError`, `ValidationError`, etc
- Erros customizados com `code`, `statusCode`, `details`
- Reutilizáveis em todos os módulos

### **4.1. Error Handling Global**
- Plugin Elysia em `lib/http/plugins/error.ts`
- Trata `AppError` via `instanceof`
- Converte erros do Elysia (ex.: `VALIDATION`, `PARSE`, `NOT_FOUND`)
- Resposta padronizada: `{ code, message }`

### **5. Barrel Exports**
- Cada módulo exporta apenas sua API pública via `index.ts`
- **Exportar**: types, services, routes
- **NÃO exportar**: dto, controllers, client (internos)
- Facilita refatorações internas

### **6. Configuração Centralizada**
- Todas as configurações em `config/`
- Fácil manutenção e reutilização
- Separação de concerns

### **7. Type Safety**
- TypeScript em modo strict
- DTOs para validação runtime
- Tipos compartilhados em `modules/common/types`
- Interfaces específicas em `types/` de cada módulo

---

## 📦 Módulos Existentes

### **Auth Module** (`modules/auth/`)
Gerencia autenticação e autorização usando Better Auth.

**Estrutura:**
```
auth/
├── client/
│   └── better-auth.client.ts   # Cliente Better Auth configurado
├── controllers/
│   └── index.ts                # AuthController
├── routes/
│   └── index.ts                # Rotas auxiliares
├── docs.ts                     # Documentação OpenAPI
├── auth.routes.ts              # (legacy) compat
└── index.ts
```

**Endpoints:**
- As rotas principais são expostas automaticamente pelo Better Auth via plugin (`basePath: /auth`)
- `GET /auth/session`: Helper para obter sessão atual

---

### **Storage Module** (`modules/storage/`)
Gerencia upload de arquivos usando Supabase Storage.

**Estrutura:**
```
storage/
├── client/
│   └── supabase.client.ts       # Cliente Supabase configurado
├── dto/
│   └── index.ts                 # Validações (uploadFileDto, etc)
├── services/
│   ├── storage.service.ts       # Abstract class
│   ├── supabase-storage.service.ts  # Implementação Supabase
│   └── index.ts                 # Factory createStorageService()
├── controllers/
│   └── index.ts                 # StorageController
├── routes/
│   └── index.ts                 # storageRoutes
├── types/
│   └── index.ts                 # UploadResult, UploadOptions
└── index.ts
```

**Endpoints:**
- `POST /storage/upload`: Upload de arquivo (autenticado)
- `DELETE /storage/:path`: Deletar arquivo (autenticado)
- `GET /storage/list`: Listar arquivos (autenticado)

**Exemplo de uso:**
```typescript
// Trocar implementação facilmente
export const createStorageService = (): StorageService => {
  if (process.env.STORAGE_PROVIDER === 's3') {
    return new S3StorageService();
  }
  return new SupabaseStorageService();
};
```

---

### **Users Module** (`modules/users/`)
Gerencia operações relacionadas a usuários.

**Estrutura:**
```
users/
├── dto/
│   └── index.ts                 # getMeDto, updateProfileDto
├── services/
│   ├── users.service.ts         # Abstract class
│   ├── users-db.service.ts      # Implementação com Drizzle
│   └── index.ts                 # Factory createUsersService()
├── controllers/
│   └── index.ts                 # UsersController
├── routes/
│   └── index.ts                 # usersRoutes
├── types/
│   └── index.ts                 # UserProfile
└── index.ts
```

**Endpoints:**
- `GET /users/`: Retorna dados do usuário autenticado

**Exemplo de uso:**
```typescript
// services/users.service.ts (Abstract)
export abstract class UsersService {
  abstract getMe(userId: string): Promise<UserProfile | null>;
}

// services/users-db.service.ts (Implementação)
export class UsersDbService extends UsersService {
  async getMe(userId: string) {
    return await db.select().from(user).where(eq(user.id, userId));
  }
}
```

---

### **Products Module** (`modules/products/`)
Gerencia produtos do sistema de leilão.

**Estrutura:**
```
products/
├── dto/
│   └── index.ts                 # createProductDto
├── services/
│   ├── products.service.ts      # Abstract class
│   ├── products-db.service.ts   # Implementação (TODO)
│   └── index.ts                 # Factory createProductsService()
├── controllers/
│   └── index.ts                 # ProductsController
├── routes/
│   └── index.ts                 # productsRoutes
├── types/
│   └── index.ts                 # Product, CreateProductData
└── index.ts
```

**Endpoints:**
- `POST /products/`: Criar produto (autenticado)

**Schema do banco:**
```typescript
{
  id: uuid,
  name: text,
  description: text,
  imageUrl: text,
  ownerId: uuid (FK -> users),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🔌 Plugins e Middlewares

### **Auth Plugin** (`lib/http/plugins/auth.ts`)

Plugin Elysia que integra Better Auth e fornece macro de autenticação.

**Funcionalidades:**
- Monta o handler do Better Auth
- Fornece macro `auth: true` para proteger rotas
- Valida sessão via headers
- Retorna dados do usuário e sessão

**Uso:**
```typescript
import { authPlugin } from '@/lib/http/plugins';

export const protectedRoutes = new Elysia()
  .use(authPlugin)
  .get('/protected', handler, { auth: true });
```

---

## 🗄️ Database Schema

### **Tabelas Principais**

#### **user**
```typescript
{
  id: uuid (PK),
  name: text,
  email: text (unique),
  emailVerified: boolean,
  image: text,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **product**
```typescript
{
  id: uuid (PK),
  name: text,
  description: text,
  imageUrl: text,
  ownerId: uuid (FK -> user.id),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **auction**
```typescript
{
  id: uuid (PK),
  productId: uuid (FK -> product.id),
  sellerId: uuid,
  startPrice: decimal(10,2),
  minStep: decimal(10,2),
  buyNowPrice: decimal(10,2),
  status: enum (PENDING, ACTIVE, COMPLETED, CANCELLED),
  startsAt: timestamp,
  endsAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **bid**
```typescript
{
  id: uuid (PK),
  auctionId: uuid (FK -> auction.id),
  bidderId: uuid,
  amount: decimal(10,2),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### **Tabelas de Autenticação (Better Auth)**
- `session`: Sessões de usuário
- `account`: Contas OAuth
- `verification`: Tokens de verificação

---

## 🚀 Como Adicionar um Novo Módulo

### Passo 1: Criar estrutura de pastas
```bash
mkdir -p src/modules/nome-modulo/{dto,services,controllers,routes,types}
```

### Passo 2: Criar tipos
```typescript
// src/modules/nome-modulo/types/index.ts
export interface NomeModulo {
  id: string;
  name: string;
  createdAt: Date;
}
```

### Passo 3: Criar DTOs
```typescript
// src/modules/nome-modulo/dto/index.ts
import { t } from 'elysia';

export const createNomeModuloDto = t.Object({
  name: t.String({ minLength: 3 }),
});
```

### Passo 4: Criar Service (Abstract)
```typescript
// src/modules/nome-modulo/services/nome-modulo.service.ts
import type { NomeModulo } from '../types';

export abstract class NomeModuloService {
  abstract create(data: any): Promise<NomeModulo>;
  abstract getById(id: string): Promise<NomeModulo | null>;
}
```

### Passo 5: Criar Implementação
```typescript
// src/modules/nome-modulo/services/nome-modulo-db.service.ts
import { NomeModuloService } from './nome-modulo.service';
import { db } from '@/lib/database/drizzle/client';

export class NomeModuloDbService extends NomeModuloService {
  async create(data: any) {
    // Implementação com Drizzle
  }

  async getById(id: string) {
    // Implementação com Drizzle
  }
}
```

### Passo 6: Criar Factory
```typescript
// src/modules/nome-modulo/services/index.ts
import { NomeModuloDbService } from './nome-modulo-db.service';
import type { NomeModuloService } from './nome-modulo.service';

export * from './nome-modulo.service';
export * from './nome-modulo-db.service';

export const createNomeModuloService = (): NomeModuloService => {
  return new NomeModuloDbService();
};
```

### Passo 7: Criar Controller
```typescript
// src/modules/nome-modulo/controllers/index.ts
import { createNomeModuloService } from '../services';
import type { NomeModuloService } from '../services';

export class NomeModuloController {
  private service: NomeModuloService;

  constructor() {
    this.service = createNomeModuloService();
  }

  create = async ({ body }: { body: any }) => {
    const result = await this.service.create(body);
    return { success: true, data: result };
  };
}
```

### Passo 8: Criar Routes
```typescript
// src/modules/nome-modulo/routes/index.ts
import { Elysia } from 'elysia';
import { authPlugin } from '@/lib/http/plugins';
import { NomeModuloController } from '../controllers';
import { createNomeModuloDto } from '../dto';

const controller = new NomeModuloController();

export const nomeModuloRoutes = new Elysia({ prefix: '/nome-modulo' })
  .use(authPlugin)
  .post('/', controller.create, {
    body: createNomeModuloDto,
    auth: true,
    detail: {
      tags: ['NomeModulo'],
      summary: 'Criar novo item',
    },
  });
```

### Passo 9: Criar Barrel Export
```typescript
// src/modules/nome-modulo/index.ts
export * from './types';
export * from './services';
export * from './routes';

// NÃO exportar: dto, controllers (internos)
```

### Passo 10: Registrar no index.ts principal
```typescript
import { nomeModuloRoutes } from './modules/nome-modulo';

const app = new Elysia()
  // ... outras configurações
  .use(nomeModuloRoutes);
```

---

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
bun run dev                 # Inicia servidor em modo watch

# Database
bun run db:generate         # Gera migrations do Drizzle
bun run db:migrate          # Executa migrations
bun run db:studio           # Abre Drizzle Studio
```

---

## 🔐 Variáveis de Ambiente

```env
PORT=8080
DATABASE_URL=postgresql://user:password@localhost:5434/flashbid
BETTER_AUTH_SECRET=your-secret-key
SUPABASE_URL_PROJECT=your-supabase-url
SUPABASE_API_KEY_SECRET=your-supabase-key
SUPABASE_BUCKET=your-bucket-name
```

---

## 📚 Próximos Passos

### Melhorias Implementadas ✅

1. ✅ **Services Layer com Abstract Classes**
   - Lógica de negócio separada dos controllers
   - Fácil trocar implementação (Supabase → S3, etc)

2. ✅ **DTOs com Elysia Type System**
   - Validação declarativa em `dto/index.ts`
   - Type safety em runtime

3. ✅ **Error Handling Centralizado**
   - Classes de erro em `modules/common/errors/`
   - Hierarquia: `AppError` → erros específicos

### Melhorias Futuras

1. **Logging**
   - Implementar logger estruturado
   - Rastreamento de requisições

2. **Testes**
   - Testes unitários para services
   - Testes de integração para rotas
   - Testes E2E

3. **Middleware Global de Erros**
   - Capturar e formatar erros automaticamente
   - Retornar respostas consistentes

4. **Repository Pattern** (opcional)
   - Abstrair ainda mais o acesso ao banco
   - Útil se precisar suportar múltiplos bancos

---

## 📖 Referências

- [Elysia.js Documentation](https://elysiajs.com)
- [Better Auth Documentation](https://better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

**Última atualização:** 2026-02-20
