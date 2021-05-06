'use strict';

const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs-extra');

const dotenvFilePath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(dotenvFilePath)) {
  dotenv.config({ path: dotenvFilePath });
}

const STRAPI_ADMIN = /^STRAPI_ADMIN_/i;

const getClientEnvironment = (useEE, options) => {
  const raw = Object.keys(process.env)
    .filter(key => STRAPI_ADMIN.test(key))
    .reduce(
      (acc, current) => {
        acc[current] = process.env[current];

        return acc;
      },
      {
        ADMIN_PATH: options.adminPath,
        BACKEND_URL: options.backend,
        ENABLED_EE_FEATURES: options.features,
        PROJECT_TYPE: useEE ? 'Enterprise' : 'Community',
        NODE_ENV: process.env.NODE_ENV || 'development',
        // REQUIRED STRAPI_ADMIN variables
        // TODO
        // STRAPI_ADMIN_SHOW_TUTORIALS: 'true',
      }
    );

  const stringified = Object.keys(raw).reduce((env, key) => {
    env[key] = JSON.stringify(raw[key]);
    return env;
  }, {});

  return stringified;
};

module.exports = getClientEnvironment;
