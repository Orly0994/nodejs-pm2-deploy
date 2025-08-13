require('dotenv').config({ path: '.env.deploy' });

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_REF = 'origin/main', REPO_URL, DEPLOY_PORT
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
      env_production: {
        PM2_SERVE_PATH: 'frontend/build',
        PM2_SERVE_PORT: 3001,
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
      path: `/home/${DEPLOY_USER}/nodejs-pm2-deploy/`,
      'pre-deploy-local': 'echo "Deploying to production..."; scp -r ./backend/.env.production orly@158.160.149.97:/home/orly/nodejs-pm2-deploy/current/backend/.env;',
      'post-deploy': `
        . ~/.nvm/nvm.sh;
        . ~/.profile;
        . ~/.bashrc;
        cd backend && npm install && pm2 startOrRestart ecosystem.config.js --env production;
        cd ../frontend && npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env production;
        pm2 save;
      `
    }
  }
};