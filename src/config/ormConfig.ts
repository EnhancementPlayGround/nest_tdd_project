import { Balance } from 'src/services/balance/balance.entity';
import { Order } from 'src/services/order/order.entity';
import { Product } from 'src/services/product/product.entity';

const entities = [Order, Balance, Product];
const mysqlConfig = {
  type: 'mysql',
  host: { $env: 'DB_HOST' },
  port: { $env: 'DB_PORT' },
  database: { $env: 'DB_NAME' },
  username: { $env: 'DB_USER' },
  password: { $env: 'DB_PASSWORD' },
  timezone: 'UTC+0',
};

export const ormconfig = {
  $filter: { $env: 'NODE_ENV' },
  production: {
    ...mysqlConfig,
    synchronize: false,
    // migrations: ['src/migration/**/*.ts'],
    supportBigNumbers: true,
    entities,
    bigNumberStrings: false,
  },
  development: {
    ...mysqlConfig,
    synchronize: true,
    // migrations: ['dist/src/migrations/*.js'],
    supportBigNumbers: true,
    entities,
    bigNumberStrings: false,
    logging: true,
  },
  test: {
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    database: 'test',
    username: 'root',
    password: '1234',
    synchronize: false,
    migrations: ['src/migrations/*{.ts,.js}'],
    supportBigNumbers: true,
    entities,
    bigNumberStrings: false,
  },
  $default: {
    ...mysqlConfig,
    synchronize: false,
    migrations: ['dist/src/migrations/*.js'],
    supportBigNumbers: true,
    entities,
    bigNumberStrings: false,
  },
};
