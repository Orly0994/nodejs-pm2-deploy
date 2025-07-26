#!/bin/bash
set -e

echo "Backend:"
cd "${DEPLOY_PATH}/current/backend"
yarn install
yarn build

echo "Frontend:"
cd "${DEPLOY_PATH}/current/frontend"
yarn install --production
yarn build

echo "Pm2:"
npm install dotenv
pm2 startOrRestart "${DEPLOY_PATH}/current/ecosystem.config.js" --env production
pm2 save

echo "Completed"