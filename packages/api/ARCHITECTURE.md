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

- `ApiResponse<T>`: Standard response wrapper `{ success: boolean, data: T }`.
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

## 6. Linter & Formatting
We use **Biome**.
- Use `bun run lint:fix` to fix common issues.
- Do not disable rules; use `overrides` in `biome.json` if a specific directory (like API with decorators) needs special treatment.
