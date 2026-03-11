# ⚡ FlashBid API | High-Performance Auction Engine

A **FlashBid API** é o motor de alta performance por trás da plataforma FlashBid, construída com foco em escalabilidade, desacoplamento e princípios sólidos de engenharia de software. Este projeto consolida conhecimentos avançados em arquitetura de sistemas, design de APIs e práticas de desenvolvimento moderno.

---

## 🏗️ Arquitetura e Design Patterns

A API foi desenhada seguindo o padrão **Clean Architecture** adaptado para um modelo de módulos, garantindo que a lógica de negócio seja independente de frameworks e provedores externos.

### Camadas do Sistema:

- **Routes (Entry Point)**: Definição de endpoints usando Elysia e validação rigorosa com TypeBox.
- **Controllers (HTTP Bridge)**: Orquestração de requisições, mapeamento de DTOs e coordenação via DI.
- **Services (Business Logic)**: Onde reside o "coração" do sistema. Validações de domínio, regras de negócio e integração entre serviços.
- **Repositories (Data Access)**: Abstração da camada de persistência usando Drizzle ORM, permitindo trocar o banco de dados com impacto mínimo.

### Principais Padrões Aplicados:

- **Dependency Injection (DI)**: Utilização do **InversifyJS** para inversão de controle, facilitando a testabilidade e o baixo acoplamento.
- **Singleton Pattern**: Gerenciamento eficiente de instâncias de serviços e conexões.
- **Repository Pattern**: Isolamento total das consultas SQL da lógica de negócio.
- **Standardized Response**: Todas as respostas seguem o contrato `ApiResponse<T>`, garantindo consistência para o Front-end:
  ```typescript
  {
    success: boolean;
    data?: T;
    error?: { code: string; message: string; details?: any }
  }
  ```

---

## 🛠️ Tech Stack & Ferramentas

- **Runtime**: [Bun](https://bun.sh/) (Performance extrema e ferramentas integradas)
- **Framework**: [ElysiaJS](https://elysiajs.com/) (Type-safe, focado em performance)
- **DI Container**: [InversifyJS](https://inversify.io/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) (Type-safe SQL)
- **Database**: PostgreSQL (Persistência) & Redis (Cache/Queues)
- **Auth**: [Better Auth](https://www.better-auth.com/) (Framework de autenticação moderno)
- **Storage**: Supabase Storage (Gerenciamento de mídia)
- **Validation**: TypeBox (Validação em tempo de execução e inferência de tipos)

---

## ✅ Engenharia de Qualidade & Testes

A confiabilidade do sistema é garantida por uma estratégia de testes rigorosa utilizando **Vitest**:

- **Layer Isolation**: Cada camada é testada isoladamente através de mocks de suas dependências.
- **Business Logic Coverage**: 100% de cobertura nas regras críticas de leilão (ex: impedir múltiplos leilões ativos para o mesmo produto).
- **Mocking Strategy**: Uso intensivo de DI para injetar mocks em ambiente de teste, garantindo que os testes não dependam de infraestrutura real.

```bash
# Executar todos os testes da API
bun run test:api
```

---

## 🚀 Performance & Build

Para produção, a API utiliza um processo de build customizado (`scripts/build.ts`) que:

1.  Realiza **Tree-shaking** e **Minificação** agressiva.
2.  Gera um **Binário Standalone** otimizado, eliminando a necessidade de instalar o Bun no ambiente de execução.
3.  Otimiza o startup time e reduz o footprint de memória.

---

## 📖 Documentação da API

A API é auto-documentada e fácil de explorar:

- **Swagger/OpenAPI**: Disponível em `/openapi` quando o servidor está rodando.
- **HTTP Client Files**: Localizados em `docs/http/*.http`, permitem testar fluxos completos (Auth -> Product -> Auction) diretamente do VS Code ou IntelliJ.

---

## 🛠️ Como Executar

1.  **Instalação**: `bun install`
2.  **Infra**: `docker-compose up -d` (PostgreSQL + Redis)
3.  **Ambiente**: `cp .env.example .env` (Configure suas credenciais)
4.  **Database**: `bun run db:generate && bun run db:migrate`
5.  **Run**: `bun run dev`

---

## 📈 Próximos Passos

- Implementação de **WebSockets** para lances em tempo real.
- Processamento de filas assíncronas com Redis para finalização automática de leilões.
- Observabilidade avançada com OpenTelemetry.

---

_Desenvolvido como um projeto de consolidação técnica em Engenharia de Software._
