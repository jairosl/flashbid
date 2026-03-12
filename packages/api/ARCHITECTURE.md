# API Architecture & Module Pattern

This document defines the standard structure for modules in the Flashbid API. Every module must follow the **Routes -> Controller -> Service -> Repository** pattern, utilizing **InversifyJS** for Dependency Injection.

## 1. Directory Structure

A generic module (e.g., `products`) should look like this:

```text
src/modules/products/
├── index.ts              # Public exports and types
├── routes/
│   └── index.ts          # Elysia routes & DTO validation
├── controllers/
│   └── index.ts          # Request handling & DI coordination
├── services/
│   ├── products.service.ts  # Interface definition
│   └── products-db.service.ts # Concrete implementation (Business Logic)
├── repositories/
│   ├── products.repository.ts # Interface definition
│   └── drizzle-products.repository.ts # Concrete implementation (DB Logic)
├── dto/
│   └── index.ts          # TypeBox schemas for validation
└── types/
    └── index.ts          # Domain interfaces
├── errors/
    └── index.ts          # Module specific errors
```

---

## 2. Layers & Responsibilities

### A. Repository (Data Access)
Responsible **only** for direct database operations. No business logic here.
- Uses Drizzle ORM.
- Handles joins and data mapping to domain types.

### B. Service (Business Logic)
Responsible for orchestrating the business rules.
- Validates constraints (e.g., "Max 5 products per user").
- Integrates with other services (e.g., `StorageService` for uploads).
- Calls the Repository for persistence.

### C. Controller (HTTP Bridge)
Responsible for handling the bridge between HTTP and Services.
- Receives the request context (User, Body, Params).
- Calls the Service.
- Returns a standardized `ApiResponse<T>`.

### D. Routes (Entry Point)
Responsible for defining endpoints and runtime validation.
- Uses Elysia's `t` (TypeBox) for validation.
- Attaches documentation (Summary, Tags, Description).

---

## 3. Standardized Types (Common Module)

Always prefer using shared types from `@/modules/common/types`:

- `ApiResponse<T>`: Standard response wrapper `{ success: boolean, data?: T, error?: { code: string, message: string, details?: any } }`.
- `AuthenticatedRequest<TBody, TParams>`: Request context with authenticated `user`.
- `BaseRequest<TBody, TParams>`: Request context without authentication.

---

## 4. Implementation Example

### Service Interface
```typescript
export interface ProductsService {
  create(ownerId: string, data: CreateProductData): Promise<Product>;
  list(): Promise<Product[]>;
}
```

### Controller Implementation
```typescript
@injectable()
export class ProductsController {
  constructor(@inject(TYPES.ProductsService) private productsService: ProductsService) {}

  create = async ({ user, body }: AuthenticatedRequest<CreateProductData>): Promise<ApiResponse<Product>> => {
    const data = await this.productsService.create(user.id, body);
    return { success: true, data };
  };
}
```

---

## 5. Testing Best Practices

All tests must be written in **English** and focus on both **Happy Path** and **Error Scenarios**.

### Principles:
- **No `any`**: Use strict typing. Use `vi.Mock` or cast objects only when necessary in tests.
- **DI in Tests**: Use Inversify `Container` in tests to inject mocks.
- **Layer Isolation**: 
  - Test Repositories with DB mocks.
  - Test Services by mocking Repositories.
  - Test Controllers by mocking Services.

### Mocking Statics/Global Imports:
When a module uses static imports (like `bun` or `db`), mock them at the **very top** of your test file:

```typescript
import { vi } from 'vitest';
vi.mock('bun', () => ({ randomUUIDv7: vi.fn() }));

import 'reflect-metadata';
// ... other imports
```

---

## 6. HTTP Documentation & Manual Testing

We use `.http` files (compatible with REST Client/IntelliJ/VS Code) for documentation and manual verification.

- **Location**: `docs/http/*.http`
- **Environment**: Variables are defined in `docs/http-client.env.json`.
- **Chaining Requests**: Use scripts to capture IDs and tokens to be used in subsequent requests:
  ```http
  > {%
    if (response.status === 201 || response.status === 200) {
      client.global.set("productId", response.body.data.id);
    }
  %}
  ```

---

## 8. Dependency Injection & Circular Dependencies

Para evitar erros de inicialização (`ReferenceError: Cannot access 'container' before initialization`), seguimos regras estritas sobre como as dependências são importadas no container de DI.

### O Problema dos "Barrel Files" (`index.ts`)
O uso de arquivos `index.ts` para exportar tudo de um módulo é prático, mas perigoso para o Container de DI. Se um `index.ts` exporta uma **Rota** que depende do `container`, e o `container` tenta importar um **Service** através desse mesmo `index.ts`, cria-se um ciclo vicioso onde o container tenta carregar a si mesmo antes de terminar sua inicialização.

### Boa Prática: Imports Diretos no Container
Sempre importe as implementações concretas (Services, Repositories) **diretamente de seus arquivos de origem** dentro de `src/lib/di/container.ts`. Nunca use o `index.ts` do módulo neste arquivo.

#### ❌ Incorreto (Causa Dependência Circular)
```typescript
// src/lib/di/container.ts
import { UsersDbService } from '@/modules/users'; // Importa index.ts -> carrega routes -> pede o container (Erro!)
```

#### ✅ Correto (Seguro)
```typescript
// src/lib/di/container.ts
import { UsersDbService } from '@/modules/users/services/users-db.service'; // Import direto do arquivo
```

### Padrão para Loggers e Utilitários
Para preocupações transversais (*cross-cutting concerns*) como o **Logger**, preferimos o padrão **Singleton** exportado de `@/lib/logger` em vez de Injeção de Dependência. 
- **Por que?** Evita poluir todos os construtores do sistema e simplifica os testes unitários, pois o Logger Singleton pode se silenciar automaticamente em ambiente de teste sem necessidade de mocks manuais em cada arquivo `.spec.ts`.
