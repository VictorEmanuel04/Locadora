# CineLoc Backend

Backend academico para a CineLoc, uma locadora digital de filmes. Pagamentos, streaming e recomendacoes avancadas sao simulados ou resolvidos por consultas simples no banco.

## Estrutura de Pastas

```text
back/
  prisma/
    schema.prisma
  src/
    config/        Variaveis de ambiente tipadas
    controllers/   Entrada HTTP e respostas
    lib/           Clientes externos, como Prisma
    middlewares/   Autenticacao, autorizacao e erros
    routes/        Declaracao das rotas REST
    services/      Regras de negocio mais complexas quando crescer
    app.ts         Configuracao do Express
    server.ts      Bootstrap do servidor
  docs/
    API.md
```

## Modelo de Dados

- `User`: cliente ou administrador, com senha armazenada como hash.
- `Movie`: catalogo de filmes, com genero, preco, disponibilidade e estoque academico.
- `Rental`: locacao simulada, com inicio, expiracao, status e preco pago.
- `Review`: nota e resenha de um usuario para um filme. Um usuario avalia cada filme uma unica vez.
- `CartItem`: item do carrinho para simular checkout.
- `WishlistItem`: lista de desejos do usuario.

O schema completo esta em `prisma/schema.prisma`.

## Endpoints Implementados

### Auth

- `POST /api/auth/register`: cadastra cliente.
- `POST /api/auth/login`: autentica e retorna JWT.

### Movies

- `GET /api/movies`: lista filmes com filtros `search`, `genre` e `available=true`.
- `GET /api/movies/:id`: detalha filme com avaliacoes.

### Recomendacoes

- `GET /api/recommendations`: rota autenticada; sugere filmes pelo gênero mais alugado ou lançamentos para novos clientes.

### Rentals

- `GET /api/rentals`: painel do usuario com locacoes ativas e expiradas.
- `POST /api/rentals/checkout`: simula pagamento e cria locacoes ativas.
- `POST /api/rentals/:id/renew`: renova ou recompra uma locacao.

### Carrinho e wishlist

- `GET /api/wishlist`: lista de desejos do usuário autenticado.
- `POST /api/wishlist`: adiciona filme à lista de desejos.
- `DELETE /api/wishlist/:movieId`: remove filme da lista de desejos.
- `GET /api/cart`: carrinho do usuário autenticado.
- `POST /api/cart`: adiciona filme ao carrinho.
- `DELETE /api/cart/:movieId`: remove filme do carrinho.

### Reviews

- `GET /api/reviews/movie/:movieId`: lista avaliações públicas de um filme.
- `POST /api/reviews`: cria ou atualiza a avaliação do usuário autenticado.

### Admin

- `POST /api/admin/movies`: cadastra filme.
- `PUT /api/admin/movies/:id`: edita filme.
- `DELETE /api/admin/movies/:id`: remove filme.

## Regras de Negocio Iniciais

- Checkout nao chama gateways externos. Ele apenas valida disponibilidade e cria registros em `Rental`.
- Locacoes vencidas sao marcadas como `EXPIRED` quando o painel do usuario e consultado.
- O painel separa locacoes `ACTIVE` com `expiresAt` futuro das expiradas.
- Recomendacoes devem usar consultas SQL/Prisma, como melhor media de notas ou generos mais alugados.
- `ADMIN` gerencia catalogo; `CLIENT` aluga, avalia, usa carrinho e wishlist.
