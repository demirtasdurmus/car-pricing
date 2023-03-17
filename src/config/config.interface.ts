export interface IConfig {
  DB_TYPE: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASS: string;
  DB_SYNC: boolean;

  COOKIE_KEY: string;
}
