# Cinerent — Diagramas para apresentação

## 1. Arquitetura geral

```mermaid
flowchart LR
    U[Usuário] --> F[Frontend React]

    subgraph Frontend
        F --> RR[React Router]
        RR --> CTX[AuthContext]
        RR --> UI[Material UI]
        UI --> AX[Axios]
        CTX --> AX
    end

    AX -->|HTTP, JSON e JWT| RT[Rotas Express]

    subgraph Backend
        RT --> MW[Middlewares]
        MW -->|Autenticação e RBAC| C[Controllers]
        C --> S[Services]
        S --> P[Prisma Client]
    end

    P --> DB[(PostgreSQL 15)]
    D[Docker Compose] -. executa .-> DB
```

## 2. Modelo de dados com Prisma

```mermaid
erDiagram
    USER ||--o{ RENTAL : realiza
    MOVIE ||--o{ RENTAL : pertence
    USER ||--o{ REVIEW : publica
    MOVIE ||--o{ REVIEW : recebe
    USER ||--o{ CART_ITEM : possui
    MOVIE ||--o{ CART_ITEM : adicionado
    USER ||--o{ WISHLIST_ITEM : possui
    MOVIE ||--o{ WISHLIST_ITEM : salvo
    RENTAL ||--o{ RENTAL : renovada_por

    USER {
        string id PK
        string name
        string email UK
        string passwordHash
        enum role
        datetime createdAt
    }

    MOVIE {
        string id PK
        string title
        string genre
        decimal rentalPrice
        int discountPercentage
        enum availability
        int stock
    }

    RENTAL {
        string id PK
        string userId FK
        string movieId FK
        datetime startsAt
        datetime expiresAt
        enum status
        decimal pricePaid
        string renewedFromId FK
    }

    REVIEW {
        string id PK
        string userId FK
        string movieId FK
        int rating
        string comment
    }

    CART_ITEM {
        string id PK
        string userId FK
        string movieId FK
    }

    WISHLIST_ITEM {
        string id PK
        string userId FK
        string movieId FK
    }
```

## 3. Autenticação com JWT

```mermaid
sequenceDiagram
    actor U as Usuário
    participant F as Frontend
    participant A as AuthController
    participant S as AuthService
    participant P as Prisma
    participant DB as PostgreSQL

    U->>F: Informa email e senha
    F->>A: POST /api/auth/login
    A->>S: authenticateUser()
    S->>P: Buscar usuário por email
    P->>DB: SELECT
    DB-->>P: Usuário encontrado
    P-->>S: Dados do usuário
    S->>S: Comparar hash da senha

    alt Credenciais válidas
        S->>S: Gerar JWT com id e role
        S-->>A: Usuário e token
        A-->>F: 200 OK
        F->>F: Armazenar sessão
    else Credenciais inválidas
        S-->>A: INVALID_CREDENTIALS
        A-->>F: 401 Unauthorized
    end
```

## 4. Autorização e RBAC administrativo

```mermaid
flowchart TD
    A[Requisição para /api/admin] --> T{Token informado?}

    T -->|Não| U401[401 Unauthorized]
    T -->|Sim| V{JWT válido?}

    V -->|Não| U401
    V -->|Sim| R{Role é ADMIN?}

    R -->|Não| U403[403 Forbidden]
    R -->|Sim| C[AdminController]

    C --> S[AdminService]
    S --> P[Prisma Client]
    P --> DB[(PostgreSQL)]
```

## 5. Checkout transacional

```mermaid
flowchart TD
    I[Cliente finaliza o carrinho] --> C[RentalController]
    C --> V{Payload e usuário válidos?}

    V -->|Não| E400[400 Bad Request]
    V -->|Sim| S[RentalService]

    S --> D{Existem IDs duplicados?}
    D -->|Sim| E400
    D -->|Não| TX[Iniciar transação Prisma]

    TX --> B[Buscar filmes]
    B --> A{Disponíveis e com estoque?}

    A -->|Não| RB[Rollback]
    A -->|Sim| DS[Decrementar estoque]

    DS --> CP[Calcular preço final]
    CP --> CR[Criar locações]
    CR --> LC[Limpar itens do carrinho]
    LC --> CM[Commit]
    CM --> OK[201 Created]

    RB --> E400
```

## 6. Cálculo e persistência do desconto

```mermaid
flowchart LR
    PO[Preço original] --> CD[Calcular desconto]
    DP[Percentual de desconto] --> CD

    CD --> F["preço - preço × desconto / 100"]
    F --> PP[Preço final]
    PP --> R[(Rental.pricePaid)]

    R --> H[Histórico preservado]
```

## 7. Expiração e renovação

```mermaid
flowchart TD
    CH[Checkout] --> EA[Status ACTIVE]
    EA --> EX[Definir expiresAt]
    EX --> Q[Usuário consulta GET /api/rentals]

    Q --> D{expiresAt já passou?}

    D -->|Não| AT[Manter ACTIVE]
    D -->|Sim| UP[Atualizar para EXPIRED]

    UP --> LS[Listar como expirada]
    AT --> LA[Listar como ativa]

    LS --> RN{Solicitar renovação?}
    RN -->|Sim| PR[Calcular novo preço]
    PR --> NR[Criar nova Rental]
    NR --> RF[Relacionar renewedFromId]
```

## 8. Avaliações e perfil social

```mermaid
flowchart TD
    U[Usuário autenticado] --> D[Detalhes do filme]
    D --> AV[Selecionar nota e comentário]
    AV --> RC[ReviewController]
    RC --> RS[ReviewService]

    RS --> VE{Avaliação já existe?}

    VE -->|Não| CR[Criar Review]
    VE -->|Sim| UP[Atualizar Review]

    CR --> DB[(PostgreSQL)]
    UP --> DB

    DB --> LIST[Exibir avaliações]
    LIST --> CLICK[Clicar no Avatar ou nome]
    CLICK --> PP[Perfil público]
    PP --> PR[Filmes avaliados pelo usuário]
```

## 9. CRUD administrativo de filmes

```mermaid
flowchart LR
    AD[Administrador] --> PA[Painel Admin]

    PA -->|POST| C[Criar filme]
    PA -->|GET paginado| L[Listar filmes]
    PA -->|PUT| E[Editar filme]
    PA -->|DELETE| D[Excluir filme]

    C --> AC[AdminController]
    L --> MC[MovieController]
    E --> AC
    D --> AC

    AC --> AS[AdminService]
    MC --> MS[MovieService]

    AS --> P[Prisma Client]
    MS --> P
    P --> DB[(PostgreSQL)]
```

## 10. Fluxo resumido de uma requisição

```mermaid
flowchart LR
    R[Route] --> M[Middleware]
    M --> C[Controller]
    C --> S[Service]
    S --> P[Prisma]
    P --> DB[(PostgreSQL)]
    DB --> P
    P --> S
    S --> C
    C --> J[Resposta HTTP e JSON]
```
