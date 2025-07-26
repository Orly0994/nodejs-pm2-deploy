require('dotenv').config();

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/main', REPO_URL, DEPLOY_PORT
} = process.env;

module.exports = {
  apps: [
    {
      name: "back",
      script: "dist/app.js",
      cwd: `./backend`,
      autorestart: true
    },
    {
      name: "front",
      script: "serve",
      env: {
        PM2_SERVE_PATH: "frontend/build",
        PM2_SERVE_PORT: 3001
      }
    },
  ],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      port: DEPLOY_PORT || 22,
      ref: DEPLOY_REF,
      repo: REPO_URL,
      path: DEPLOY_PATH,
      'pre-deploy-local': `scp -P ${DEPLOY_PORT} ./backend/.env.production ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/current/backend/.env`,
      'post-deploy': `cd ${DEPLOY_PATH}/current && DEPLOY_PATH=${DEPLOY_PATH} ./deploy.sh`
    },
  },
};