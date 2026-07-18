# Cinerent — Versão Final

**Discente:** Víctor Emanuel Mourão de Castro — 22.2.8006  
**Disciplina:** CSI606 — Desenvolvimento Web  
**Tipo de projeto:** Aplicação web full-stack para locação digital de filmes

## Resumo

O Cinerent é uma aplicação web acadêmica de locadora de filmes inspirada em plataformas modernas de streaming. O projeto foi desenvolvido com arquitetura full-stack, utilizando uma API REST em Node.js no backend, uma aplicação de página única em React no frontend e PostgreSQL como banco de dados relacional.

O sistema permite que visitantes consultem o catálogo e os detalhes dos filmes, enquanto clientes autenticados podem utilizar carrinho, realizar uma simulação de locação, consultar o histórico, manter uma lista de desejos, publicar avaliações e receber recomendações simples. Usuários também podem acessar os perfis públicos dos autores das avaliações. Administradores possuem acesso a operações de gerenciamento do catálogo, descontos e moderação de avaliações.

O fluxo financeiro é uma simulação acadêmica: não existe integração com um gateway de pagamento. O valor final da locação considera o desconto configurado no filme e é armazenado na locação como histórico do preço efetivamente pago.

## 1. Tecnologias utilizadas

### 1.1 Backend

- **Node.js:** ambiente de execução do servidor.
- **TypeScript:** tipagem estática e compilação do código da API.
- **Express 5:** construção da API REST, roteamento e middlewares.
- **Prisma ORM 6:** modelagem, migrations e acesso ao banco de dados.
- **PostgreSQL 15:** banco de dados relacional.
- **JSON Web Token (JWT):** autenticação stateless e identificação do papel do usuário.
- **bcryptjs:** geração e comparação de hashes de senha.
- **Helmet:** configuração de cabeçalhos HTTP relacionados à segurança.
- **CORS:** controle da origem autorizada a acessar a API.
- **Morgan:** registro das requisições HTTP durante o desenvolvimento.
- **dotenv:** leitura das variáveis de ambiente.
- **Docker Compose:** inicialização local do PostgreSQL.

O backend foi organizado em camadas:

```text
back/src/
├── config/         # Configuração e variáveis de ambiente
├── controllers/    # Entrada HTTP e montagem das respostas
├── lib/            # Cliente do Prisma
├── middlewares/    # Autenticação, autorização e erros
├── routes/         # Definição dos endpoints
├── services/       # Regras de negócio de filmes e locações
├── app.ts          # Configuração da aplicação Express
└── server.ts       # Inicialização do servidor
```

### 1.2 Frontend

- **React 18:** construção das interfaces por componentes.
- **TypeScript:** contratos dos dados e verificação estática.
- **Vite 8:** servidor de desenvolvimento e geração do bundle de produção.
- **Material UI 5:** componentes de interface, tema e responsividade.
- **Emotion:** mecanismo de estilos utilizado pelo Material UI.
- **styled-components:** componentes visuais reutilizáveis.
- **React Router DOM:** navegação entre as páginas da SPA e proteção visual de rotas.
- **Axios:** comunicação com a API e interceptor para envio automático do JWT.
- **ESLint:** análise estática e verificação da qualidade do código.

### 1.3 Banco de dados e domínio

O schema Prisma possui os seguintes modelos principais:

- `User`: clientes e administradores, com email único e senha armazenada como hash.
- `Movie`: filmes, preços, descontos, disponibilidade e estoque.
- `Rental`: locações, período de acesso, estado, preço pago e renovação.
- `Review`: nota e comentário de um usuário para um filme.
- `CartItem`: itens do carrinho do cliente.
- `WishlistItem`: filmes salvos na lista de desejos.

Os papéis disponíveis são `CLIENT` e `ADMIN`. Os estados de locação são `ACTIVE`, `EXPIRED` e `CANCELED`. Os estados de disponibilidade do filme são `AVAILABLE`, `UNAVAILABLE` e `COMING_SOON`.

## 2. Funcionalidades implementadas

### 2.1 Autenticação e autorização

- Cadastro de clientes.
- Login com email e senha.
- Senhas armazenadas como hash com bcryptjs.
- Geração de token JWT com prazo de expiração configurável.
- Envio automático do token pelo frontend no cabeçalho `Authorization: Bearer`.
- Persistência da sessão no `localStorage`.
- Diferenciação de papéis entre cliente e administrador.
- Middleware de autenticação para recursos privados.
- Middleware RBAC para recursos exclusivos de administradores.
- Proteção visual das páginas de perfil, carrinho e administração.

### 2.2 Catálogo e filmes

- Listagem pública de filmes.
- Busca por título ou sinopse.
- Filtro por gênero.
- Filtro de disponibilidade e estoque.
- Paginação do catálogo.
- Página pública com detalhes do filme.
- Exibição de pôster, sinopse, gênero, ano, preço e avaliações.
- Contagem de avaliações e locações nas consultas do catálogo.

### 2.3 Administração

- Cadastro de filmes.
- Leitura do catálogo existente.
- Edição dos dados do filme.
- Exclusão de filmes.
- Gerenciamento do preço de locação.
- Gerenciamento do percentual de desconto.
- Gerenciamento de estoque.
- Gerenciamento de imagem/pôster.
- Exclusão de avaliações por administradores.
- Validação dos dados recebidos pelo CRUD administrativo.

As operações administrativas são protegidas simultaneamente por autenticação e verificação do papel `ADMIN`.

### 2.4 Carrinho e checkout

- Inclusão de filmes no carrinho.
- Prevenção de itens duplicados para o mesmo usuário.
- Consulta dos itens do carrinho.
- Remoção de itens.
- Exibição de subtotal, descontos, economia e total final.
- Simulação visual de pagamento.
- Checkout autenticado com múltiplos filmes.
- Validação de disponibilidade e estoque.
- Prevenção de IDs duplicados no pedido.
- Criação das locações e decremento de estoque em transação.
- Limpeza dos itens alugados do carrinho após o checkout.
- Armazenamento do preço efetivamente pago em `Rental.pricePaid`.

O preço promocional é calculado pela expressão:

```text
preço final = preço original - (preço original × percentual de desconto / 100)
```

O mesmo cálculo é utilizado no checkout, na renovação, no detalhe do filme e no carrinho.

### 2.5 Locações e expiração

- Criação de locações com data inicial e data de expiração.
- Duração configurável pela variável `RENTAL_DURATION_DAYS`.
- Separação das locações do usuário entre ativas e expiradas.
- Atualização para `EXPIRED` quando as locações são consultadas e `expiresAt` já passou.
- Endpoint backend de renovação/recompra.
- Bloqueio de renovação enquanto a locação ainda está ativa.
- Registro da relação entre uma renovação e sua locação anterior.
- Aplicação do desconto vigente também na renovação.

### 2.6 Wishlist

- Inclusão de filmes na lista de desejos.
- Prevenção de itens duplicados.
- Consulta da wishlist no painel do cliente.
- Remoção de itens.
- Navegação da wishlist para os detalhes do filme.

### 2.7 Avaliações e resenhas

- Consulta pública das avaliações de um filme.
- Publicação de nota entre 1 e 5 por usuário autenticado.
- Comentário textual opcional.
- Uma única avaliação por usuário e filme.
- Atualização da avaliação existente por meio de `upsert`.
- Cálculo da média e da quantidade de avaliações.
- Exclusão de avaliações por administradores.

### 2.8 Recomendações

- Recomendação autenticada baseada no gênero mais frequente no histórico do cliente.
- Exclusão dos filmes que o usuário já alugou da lista recomendada.
- Fallback com filmes adicionados recentemente para usuários sem histórico.

### 2.9 Perfis sociais

- Perfil público acessível em `/perfil/:userId`.
- Nome e avatar básico do usuário.
- Quantidade de avaliações publicadas.
- Prateleira com os filmes avaliados e suas respectivas notas.
- Navegação do perfil para os detalhes do filme.
- Avatar e nome do autor clicáveis dentro das avaliações.
- Endpoint público que omite email, senha e outros dados privados.

### 2.10 Interface e experiência de uso

- Identidade visual escura com destaques em âmbar.
- Navbar com navegação, carrinho e menu do usuário.
- Layouts responsivos para catálogo, carrinho e detalhes.
- Estados de carregamento, sucesso, erro e conteúdo vazio.
- Página de autenticação unificada para login e cadastro.
- Perfil privado com abas para locações e wishlist.
- Formatação monetária em Real brasileiro.
- `ErrorBoundary` para evitar telas completamente vazias quando ocorre uma falha de renderização.
- Rota curinga que redireciona URLs desconhecidas para a página inicial.

### 2.11 Endpoints disponíveis

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/health` | Público | Verifica o funcionamento da API |
| `POST` | `/api/auth/register` | Público | Cadastra um cliente |
| `POST` | `/api/auth/login` | Público | Autentica e retorna JWT |
| `GET` | `/api/movies` | Público | Lista e filtra filmes |
| `GET` | `/api/movies/:id` | Público | Retorna os detalhes de um filme |
| `GET` | `/api/reviews/movie/:movieId` | Público | Lista avaliações de um filme |
| `POST` | `/api/reviews` | Cliente autenticado | Cria ou atualiza uma avaliação |
| `GET` | `/api/users/:id/profile` | Público | Exibe o perfil social sem dados sensíveis |
| `GET` | `/api/cart` | Autenticado | Consulta o carrinho |
| `POST` | `/api/cart` | Autenticado | Adiciona filme ao carrinho |
| `DELETE` | `/api/cart/:movieId` | Autenticado | Remove filme do carrinho |
| `GET` | `/api/wishlist` | Autenticado | Consulta a wishlist |
| `POST` | `/api/wishlist` | Autenticado | Adiciona filme à wishlist |
| `DELETE` | `/api/wishlist/:movieId` | Autenticado | Remove filme da wishlist |
| `GET` | `/api/rentals` | Autenticado | Consulta locações ativas e expiradas |
| `POST` | `/api/rentals/checkout` | Autenticado | Simula pagamento e cria locações |
| `POST` | `/api/rentals/:id/renew` | Autenticado | Renova uma locação expirada |
| `GET` | `/api/recommendations` | Autenticado | Retorna recomendações personalizadas |
| `POST` | `/api/admin/movies` | Administrador | Cadastra filme |
| `PUT` | `/api/admin/movies/:id` | Administrador | Edita filme |
| `DELETE` | `/api/admin/movies/:id` | Administrador | Exclui filme |
| `DELETE` | `/api/admin/reviews/:id` | Administrador | Exclui uma avaliação |

## 3. Funcionalidades previstas e não implementadas

As seguintes funcionalidades não fazem parte da versão funcional entregue ou foram mantidas apenas como simulação:

- **Pagamento real:** o checkout não se comunica com bancos ou gateways de pagamento.
- **Streaming/reprodução real:** o botão “Assistir Agora” é apenas visual; não existe servidor de mídia nem controle de reprodução.
- **Renovação pelo frontend:** o endpoint está disponível no backend, mas o botão “Alugar Novamente” ainda não dispara a requisição.
- **Expiração em segundo plano:** não existe cron job ou worker; o estado é atualizado sob demanda quando `GET /api/rentals` é consultado.
- **Reposição automática de estoque:** o estoque é decrementado no checkout, mas não é devolvido automaticamente quando a locação expira ou é cancelada.
- **Recomendação avançada:** não são utilizados inteligência artificial, machine learning ou filtragem colaborativa.
- **Chat ou mensagens em tempo real entre usuários.**
- **Integração com catálogos e serviços externos de filmes.**
- **Integração com serviços externos de pagamento.**

## 4. Outras funcionalidades implementadas

Além do escopo principal, foram incluídos:

- Endpoint de health check.
- Seed idempotente para criar administrador e catálogo inicial.
- Perfil social dos autores de avaliações.
- Moderação administrativa de avaliações.
- Aplicação e visualização de promoções percentuais.
- Registro histórico do valor pago, evitando que mudanças futuras de preço alterem locações anteriores.
- Transação no checkout para reduzir inconsistências entre estoque, locação e carrinho.
- Tratamento centralizado de erros da API.
- Respostas HTTP específicas para autenticação, autorização, conflitos e recursos inexistentes.
- Interceptor Axios para autenticação automática.
- Cancelamento da requisição do perfil público quando o componente é desmontado.
- Tratamento visual de erros graves de renderização.
- Configuração de CORS por variável de ambiente.
- Arquivo `.env.example` para documentar a configuração necessária.
- Docker Compose com persistência dos dados do PostgreSQL.

## 5. Principais desafios e dificuldades

### 5.1 Modelagem do domínio

Foi necessário representar usuários, filmes, locações, avaliações, carrinho e wishlist mantendo integridade referencial e evitando duplicidades. Restrições compostas, como uma avaliação por usuário/filme e um item por usuário/filme no carrinho, foram definidas diretamente no Prisma.

### 5.2 Autenticação e RBAC

A autenticação precisou funcionar de forma integrada entre JWT, middleware Express, contexto React, interceptor Axios e proteção das rotas. Além de autenticar, o sistema diferencia clientes de administradores tanto no backend quanto na interface.

### 5.3 Integração entre frontend e backend

Um dos principais desafios foi manter os contratos consistentes: nomes dos campos Prisma, formatos das respostas, endpoints e tipagens TypeScript precisaram estar alinhados. O fluxo completo do carrinho exigiu integração entre detalhe do filme, carrinho, checkout, locações e perfil.

### 5.4 Regras de locação, desconto e estoque

O checkout envolve múltiplas alterações relacionadas. Por isso, a criação das locações, o decremento do estoque e a limpeza do carrinho foram agrupados em uma transação. O uso de `Decimal` no backend e a formatação no frontend foram necessários para exibir e persistir corretamente valores monetários com desconto.

### 5.5 Expiração das locações

Foi necessário diferenciar a data de expiração do estado persistido da locação. A solução adotada atualiza locações vencidas quando o painel do usuário é consultado, evitando a necessidade de infraestrutura adicional de agendamento, mas mantendo essa automação como possível evolução.

### 5.6 Compatibilidade entre bibliotecas

A adequação ao Material UI v5 exigiu alinhar a versão do React e ajustar importações de componentes e estilos. Também foi necessário tratar diferenças de interoperabilidade ESM envolvendo Vite, Material UI, ícones e styled-components.

### 5.7 Interface responsiva e estados assíncronos

As telas precisaram representar carregamento, falhas de comunicação, listas vazias, mensagens de sucesso e permissões diferentes. O catálogo também exigiu debounce, paginação e filtros sem recarregar a página.

## 6. Instruções para instalação e execução

### 6.1 Pré-requisitos

- Git.
- Node.js compatível com Vite 8.
- npm.
- Docker e Docker Compose, ou uma instalação local do PostgreSQL 15.

### 6.2 Clonar e acessar o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd Locadora
```

### 6.3 Iniciar o PostgreSQL com Docker

Na raiz do projeto:

```bash
docker compose up -d
```

O arquivo `docker-compose.yml` cria:

```text
Host: localhost
Porta: 5432
Banco: cineloc
Usuário: adminloc
Senha: 4dm1n
```

### 6.4 Configurar e executar o backend

Entre na pasta do backend e instale as dependências:

```bash
cd back
npm install
```

Copie o exemplo de configuração:

```bash
cp .env.example .env
```

Configure o `.env` para o banco criado pelo Docker:

```env
DATABASE_URL="postgresql://adminloc:4dm1n@localhost:5432/cineloc?schema=public"
JWT_SECRET="substitua-por-uma-chave-longa-e-aleatoria"
JWT_EXPIRES_IN="7d"
RENTAL_DURATION_DAYS="7"
CORS_ORIGIN="http://localhost:5173"
```

Gere o Prisma Client e aplique as migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Opcionalmente, carregue os dados iniciais:

```bash
npx prisma db seed
```

O seed cria uma conta administrativa para desenvolvimento:

```text
Email: admin@cinerent.com
Senha: admin123
```

Essa senha deve ser alterada antes de qualquer disponibilização pública.

Inicie a API:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3333/api
```

Teste o servidor em:

```text
http://localhost:3333/api/health
```

### 6.5 Configurar e executar o frontend

Em outro terminal, a partir da raiz:

```bash
cd front
npm install
npm run dev
```

Por padrão, o frontend utiliza:

```text
http://localhost:3333/api
```

Para utilizar outra API, crie `front/.env`:

```env
VITE_API_URL="http://localhost:3333/api"
```

A aplicação ficará disponível em:

```text
http://localhost:5173
```

### 6.6 Verificações de qualidade

Backend:

```bash
npm run lint
npm run build
```

Frontend:

```bash
npm run lint
npm run build
```

### 6.7 Execução de produção local

Backend:

```bash
cd back
npm run build
npm start
```

Frontend:

```bash
cd front
npm run build
npm run preview
```

Para ambientes reais, também é necessário configurar corretamente CORS, HTTPS, segredos, banco de dados e a hospedagem dos arquivos estáticos do frontend.

## 7. Referências

- Node.js. *Node.js Documentation*. <https://nodejs.org/docs/latest/api/>.
- Express. *Express Web Framework Documentation*. <https://expressjs.com/>.
- Prisma. *Prisma ORM Documentation*. <https://www.prisma.io/docs>.
- PostgreSQL. *PostgreSQL 15 Documentation*. <https://www.postgresql.org/docs/15/>.
- React. *React Documentation*. <https://react.dev/>.
- Vite. *Vite Documentation*. <https://vite.dev/guide/>.
- TypeScript. *TypeScript Documentation*. <https://www.typescriptlang.org/docs/>.
- Material UI. *Material UI v5 Documentation*. <https://v5.mui.com/material-ui/getting-started/>.
- React Router. *React Router Documentation*. <https://reactrouter.com/>.
- Axios. *Axios Documentation*. <https://axios-http.com/docs/intro>.
- styled-components. *styled-components Documentation*. <https://styled-components.com/docs>.
- Docker. *Docker Compose Documentation*. <https://docs.docker.com/compose/>.
- JSON Web Token. *RFC 7519 — JSON Web Token*. <https://www.rfc-editor.org/rfc/rfc7519>.
- OWASP Foundation. *Password Storage Cheat Sheet*. <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>.
- Protótipo inicial do projeto: <https://ai.studio/apps/d9750227-b4bc-4eaf-bac0-b930de8402e1>.

---
