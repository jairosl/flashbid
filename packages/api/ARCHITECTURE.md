# Guia de Arquitetura da API

## Objetivo
Este documento define os princípios de arquitetura do `packages/api`, os limites entre camadas e as convenções esperadas para novos módulos.

A implementação atual é pragmática e incremental. O módulo `storage` é a referência do modelo de camadas vigente e ainda será evoluído (por exemplo, com use-cases explícitos quando a complexidade aumentar).

## Direção Arquitetural
A API segue uma arquitetura modular inspirada em:

- Clean Architecture (dependências apontando para dentro)
- Hexagonal Architecture (ports and adapters)
- Organização por domínio (módulos por contexto de negócio)

Na prática, cada módulo separa responsabilidade de transporte HTTP, regra de negócio e integração com infraestrutura.

## Modelo de Camadas
Fluxo atual por módulo:

`Routes -> DTO -> Controller -> Service Contract -> Service Implementation -> External Systems`

- `Routes`: endpoints HTTP, middlewares e metadados OpenAPI
- `DTO`: schema de entrada/saída e validação em runtime
- `Controller`: orquestração da requisição; sem lógica pesada
- `Service Contract`: contrato abstrato (porta)
- `Service Implementation`: adaptador concreto para DB/SDK/provedor
- `External Systems`: PostgreSQL, Supabase Storage, Better Auth etc.

### Regra de Dependência
As dependências devem seguir para dentro:

- routes dependem de controllers e DTOs
- controllers dependem de contratos de service
- contratos dependem apenas de tipos de domínio
- implementações dependem de framework/SDK e satisfazem contratos

Camadas superiores não devem conhecer detalhes de infraestrutura.

## Storage como Referência
O módulo `storage` exemplifica o padrão atual.

### Exemplo Genérico de Requisição
1. A rota recebe `POST /storage/upload` com multipart.
2. O DTO valida tipo e tamanho do arquivo.
3. O controller aplica política da aplicação (ex.: pasta fixa e owner autenticado).
4. O controller chama o contrato `StorageService`.
5. A implementação concreta (`SupabaseStorageService`) faz upload, persiste metadados e retorna resposta.

No delete, a ideia é a mesma:

1. A rota recebe `DELETE /storage/:imageId`.
2. O DTO valida UUID.
3. O controller envia `imageId` + id do usuário autenticado.
4. A implementação valida ownership, remove no storage e remove metadado no banco.

Isso mantém HTTP e provedor isolados da intenção de negócio.

## Estrutura Padrão de Módulo
Estrutura esperada para módulos de feature (pastas podem ser omitidas quando não fizer sentido):

```txt
src/modules/<module>/
  client/        # clientes externos / SDK
  dto/           # schemas de entrada e saída
  controllers/   # orquestração HTTP
  services/      # contratos, implementações e factory
  routes/        # declaração de endpoints
  types/         # tipos do módulo
  errors/        # erros específicos do módulo
  index.ts       # exportação pública do módulo
```

## Princípios

### 1. Responsabilidade Única
Cada camada tem um único motivo para mudar.

- route muda por transporte HTTP
- dto muda por contrato/validação
- controller muda por orquestração
- service muda por regra de negócio
- implementação muda por tecnologia/provedor

### 2. Contratos Explícitos
Use contratos abstratos de service antes da implementação.

Benefícios:

- troca de provedor com menor impacto (Supabase -> S3)
- testes mais simples com mocks/fakes
- separação clara entre intenção e integração

### 3. Validação na Borda
Toda entrada externa deve ser validada em DTO antes da lógica de negócio.

### 4. Normalização de Erros
Use hierarquia de erro compartilhada para evitar vazamento de erro cru de SDK e manter respostas consistentes.

### 5. Segurança por Padrão
Operações de negócio devem validar ownership/autorização na implementação de service, não só na camada HTTP.

## Boas Práticas

- Mantenha controllers finos; concentre regras em services.
- Não acesse DB/SDK direto em routes/controllers.
- Mantenha internals do módulo privados; exporte só API pública no `index.ts`.
- Prefira retornos determinísticos (evitar formatos ad-hoc por endpoint).
- Isole configuração de ambiente e integração em `client/` e `config/`.
- Adicione metadados OpenAPI nas rotas.
- Use factories (`createXService`) como ponto de composição.

## Lacunas Atuais e Evolução Planejada
A arquitetura é incremental. Evoluções previstas:

- introduzir use-cases explícitos em domínios mais complexos
- separar repository/gateway quando necessário
- adicionar workers assíncronos com fila baseada em Redis
- padronizar observabilidade (logs estruturados, métricas, correlação)
- ampliar cobertura de testes de contrato e integração por módulo

## Checklist de PR (Arquitetura)

- Respeitou `Routes -> DTO -> Controller -> Service -> Implementation`
- DTO validou toda entrada externa
- Controller não acessa DB/SDK diretamente
- Existe contrato de service agnóstico de implementação
- Implementação valida ownership e invariantes
- Erros usam modelo compartilhado
- Rotas têm metadados OpenAPI
- Módulo exporta apenas API pública

## Documentos Relacionados
- Visão geral e setup local: `README.md`
- Exemplos HTTP: `docs/http/*.http`
