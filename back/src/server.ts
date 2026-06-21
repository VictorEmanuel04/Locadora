import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`CineLoc API rodando em http://localhost:${env.port}/api`);
});
