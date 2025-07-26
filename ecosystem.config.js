require('dotenv').config({ path: '.env.deploy' });

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/main', REPO_URL, DEPLOY_PORT
} = process.env;

module.exports = {
  apps: [
    {
      name: 'backend',
      script: './backend/app.js',
      env_production: {
        NODE_ENV: 'production',
        PORT: DEPLOY_PORT
      },
    },
    {
      name: 'frontend',
      script: 'serve',
      args: ['-s', 'frontend/build', '-l', '80'],
      env_production: {
        PM2_SERVE_PATH: 'frontend/build',
        PM2_SERVE_PORT: 80,
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: REPO_URL,
      path: `/home/${DEPLOY_USER}/nodejs-pm2-deploy`,
      'pre-deploy-local': `
        scp -r ./backend/.env.production ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/source/backend/.env;
      `,
      'post-deploy': `
        cd backend && npm install && pm2 startOrRestart ecosystem.config.js --env production;
        cd ../frontend && npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env production;
        pm2 save;
      `
    }
  }
};