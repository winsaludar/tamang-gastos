import Fastify from "fastify";
import ajvErrors from "ajv-errors";
import authRoutes from "./modules/auth/infrastructure/authRoutes.js";
import errorHandler from "./common/errorHandler.js";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { jwtConfig } from "./common/config/config.js";
import { registerHooks } from "./common/middlewares/hooks.js";
import { swaggerOptions } from "./common/config/swagger.js";

export async function createApp() {
  const fastify = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        allErrors: true,
        $data: true,
      },
      plugins: [ajvErrors],
    },
  });

  // Register custom error handler
  fastify.setErrorHandler(errorHandler);

  // Register JWT plugin
  fastify.register(fastifyJwt, { secret: jwtConfig.secret });

  // Register swagger
  fastify.register(fastifySwagger);
  fastify.register(fastifySwaggerUi, swaggerOptions);

  // Register api routes
  fastify.register(authRoutes, { prefix: "/api/auth" });

  // Register global hooks
  registerHooks(fastify);

  return fastify;
}
