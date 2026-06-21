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

## Endpoints Sugeridos

### Auth

- `POST /api/auth/register`: cadastra cliente.
- `POST /api/auth/login`: autentica e retorna JWT.

### Movies

- `GET /api/movies`: lista filmes com filtros `search`, `genre` e `available=true`.
- `GET /api/movies/:id`: detalha filme com avaliacoes.
- `GET /api/movies/recommendations/top-rated`: sugestao futura baseada em media de `Review`.
- `GET /api/movies/recommendations/by-genre`: sugestao futura baseada nos generos alugados pelo usuario.

### Rentals

- `GET /api/rentals`: painel do usuario com locacoes ativas e expiradas.
- `POST /api/rentals/checkout`: simula pagamento e cria locacoes ativas.
- `POST /api/rentals/:id/renew`: renova ou recompra uma locacao.

### Users

- `GET /api/users/me`: dados do painel.
- `GET /api/users/me/wishlist`: lista de desejos.
- `POST /api/users/me/wishlist`: adiciona filme a lista.
- `DELETE /api/users/me/wishlist/:movieId`: remove filme da lista.
- `GET /api/users/me/cart`: carrinho.
- `POST /api/users/me/cart`: adiciona filme ao carrinho.
- `DELETE /api/users/me/cart/:movieId`: remove filme do carrinho.

### Reviews

- `POST /api/movies/:movieId/reviews`: cria ou atualiza avaliacao.
- `DELETE /api/reviews/:id`: remove avaliacao do proprio usuario ou por admin.

### Admin

- `POST /api/admin/movies`: cadastra filme.
- `PUT /api/admin/movies/:id`: edita filme.
- `DELETE /api/admin/movies/:id`: remove filme.
- `PATCH /api/admin/movies/:id/availability`: altera disponibilidade.
- `GET /api/admin/rentals`: acompanha locacoes.
- `POST /api/admin/promotions`: promocao simulada alterando preco dos filmes.

## Regras de Negocio Iniciais

- Checkout nao chama gateways externos. Ele apenas valida disponibilidade e cria registros em `Rental`.
- Locacoes vencidas sao marcadas como `EXPIRED` quando o painel do usuario e consultado.
- O painel separa locacoes `ACTIVE` com `expiresAt` futuro das expiradas.
- Recomendacoes devem usar consultas SQL/Prisma, como melhor media de notas ou generos mais alugados.
- `ADMIN` gerencia catalogo; `CLIENT` aluga, avalia, usa carrinho e wishlist.
