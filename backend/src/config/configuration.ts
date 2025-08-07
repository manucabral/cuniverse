export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'Astrog',
    version: process.env.VERSION ?? '0.0.1',
    port: parseInt(process.env.PORT ?? '3000', 10),
    environment: process.env.NODE_ENV ?? 'development',
    prefix: process.env.API_PREFIX ?? 'api',
  },
  // add logging and cors option
  security: {
    jwt_secret: process.env.JWT_SECRET ?? 'defaultJwtSecret',
    tokens: {
      access: {
        expiration: process.env.ACCESS_TOKEN_EXPIRATION ?? '1d',
        secret: process.env.ACCESS_TOKEN_SECRET ?? 'defaultAccessTokenSecret',
      },
    },
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI ?? 'mongodb://localhost/astrog',
    },
  },
});
