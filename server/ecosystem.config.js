"use strict";

module.exports = {
  apps: [
    {
      name: "Vting",
      script: "./dist/index",
      watch: " true",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
