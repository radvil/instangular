import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    MONGO_URI: str(),
    MONGO_DBNAME: str(),
    JWT_SECRET: str(),
  });
}

export default validateEnv;