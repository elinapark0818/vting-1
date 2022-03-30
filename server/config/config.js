require("dotenv").config();
const env = process.env;

const development = {
  username: env.DATABASE_USERNAME,
  //env.DATABASE_USERNAME은 불러오고자 하는 데이터의 키값이므로 자유롭게 이름설정이 가능하다.
  password: env.DATABASE_PASSWORD,
  database: "vting_dev",
  host: env.DATABASE_HOST,
  dialect: "mongodb",
  //port: env.DATABASE_URL_PORT
};

const developmentaws = {
  username: env.DATABASE_USERNAME,
  //env.DATABASE_USERNAME은 불러오고자 하는 데이터의 키값이므로 자유롭게 이름설정이 가능하다.
  password: env.DATABASE_PASSWORD,
  database: "vting_dev_aws",
  host: env.DATABASE_HOST,
  dialect: "mongodb",
  //port: env.DATABASE_URL_PORT
};

const production = {
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: "db_product_vting",
  host: env.DATABASE_HOST,
  dialect: "mongodb",
  //port: env.DATABASE_URL_PORT
};

const test = {
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: "db_test_vting",
  host: env.DATABASE_HOST,
  dialect: "mongodb",
  //port: env.DATABASE_URL_PORT
};

module.exports = { development, developmentaws, production, test };
