export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'Astrog',
    version: process.env.VERSION ?? '0.0.1',
    port: parseInt(process.env.PORT ?? '3000', 10),
    environment: process.env.NODE_ENV ?? 'development',
    prefix: process.env.API_PREFIX ?? 'api',
  },
  security: {
    bcrypt_salt: process.env.BCRYPT_SALT ?? '10',
    jwt_secret: process.env.JWT_SECRET ?? 'defaultJwtSecret',
    tokens: {
      access: {
        expiration: process.env.ACCESS_TOKEN_EXPIRATION ?? '30m',
        secret: process.env.ACCESS_TOKEN_SECRET ?? 'defaultAccessTokenSecret',
      },
      refresh: {
        expiration: process.env.REFRESH_TOKEN_EXPIRATION ?? '7d',
        secret: process.env.REFRESH_TOKEN_SECRET ?? 'defaultRefreshTokenSecret',
      },
    },
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI ?? 'mongodb://localhost/astrog',
    },
  },
});
