/**
 * Professional PM2 Configuration
 * Enterprise-grade process management for production deployment
 * 
 * @module PM2Config
 * @description PM2 ecosystem configuration for multi-subdomain applications
 */

module.exports = {
  apps: [
    {
      name: 'winfoa-main',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/app',
      
      // Environment configuration
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      
      // Advanced configuration
      instances: 'max', // Use all available CPUs
      exec_mode: 'cluster',
      
      // Monitoring and logging
      log_file: '/var/log/pm2/winfoa-main.log',
      out_file: '/var/log/pm2/winfoa-main-out.log',
      error_file: '/var/log/pm2/winfoa-main-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Performance optimization
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Health monitoring
      health_check_url: 'http://localhost:3000/api/health',
      health_check_grace_period: 3000,
      
      // Auto-restart configuration
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],
      watch_options: {
        followSymlinks: false,
      },
      
      // Resource limits
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 8000,
      
      // Advanced features
      autorestart: true,
      max_memory_restart: '500M',
      
      // Environment variables
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        NEXT_TELEMETRY_DISABLED: 1,
      },
      
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
        HOSTNAME: '0.0.0.0',
        NEXT_TELEMETRY_DISABLED: 1,
      },
    },
    
    // =============================================================================
    // BACKGROUND WORKERS
    // =============================================================================
    
    {
      name: 'winfoa-worker-email',
      script: 'dist/workers/email.worker.js',
      cwd: '/app',
      
      env: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'email',
      },
      
      instances: 2,
      exec_mode: 'cluster',
      
      log_file: '/var/log/pm2/winfoa-worker-email.log',
      out_file: '/var/log/pm2/winfoa-worker-email-out.log',
      error_file: '/var/log/pm2/winfoa-worker-email-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      max_memory_restart: '256M',
      restart_delay: 2000,
      max_restarts: 5,
      min_uptime: '5s',
      
      autorestart: true,
      watch: false,
    },
    
    {
      name: 'winfoa-worker-notifications',
      script: 'dist/workers/notification.worker.js',
      cwd: '/app',
      
      env: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'notifications',
      },
      
      instances: 2,
      exec_mode: 'cluster',
      
      log_file: '/var/log/pm2/winfoa-worker-notifications.log',
      out_file: '/var/log/pm2/winfoa-worker-notifications-out.log',
      error_file: '/var/log/pm2/winfoa-worker-notifications-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      max_memory_restart: '256M',
      restart_delay: 2000,
      max_restarts: 5,
      min_uptime: '5s',
      
      autorestart: true,
      watch: false,
    },
    
    {
      name: 'winfoa-worker-analytics',
      script: 'dist/workers/analytics.worker.js',
      cwd: '/app',
      
      env: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'analytics',
      },
      
      instances: 1,
      exec_mode: 'fork',
      
      log_file: '/var/log/pm2/winfoa-worker-analytics.log',
      out_file: '/var/log/pm2/winfoa-worker-analytics-out.log',
      error_file: '/var/log/pm2/winfoa-worker-analytics-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      max_memory_restart: '512M',
      restart_delay: 3000,
      max_restarts: 3,
      min_uptime: '10s',
      
      autorestart: true,
      watch: false,
    },
  ],
  
  // =============================================================================
  // DEPLOYMENT CONFIGURATION
  // =============================================================================
  
  deploy: {
    production: {
      user: 'node',
      host: ['production-server-1', 'production-server-2'],
      ref: 'origin/main',
      repo: 'git@github.com:winfoa/cms-winfoa.git',
      path: '/var/www/winfoa',
      'post-deploy': 'npm install && npm run build:optimize && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt-get update && apt-get install -y git',
      'post-setup': 'ls -la',
      env: {
        NODE_ENV: 'production',
      },
    },
    
    staging: {
      user: 'node',
      host: 'staging-server',
      ref: 'origin/develop',
      repo: 'git@github.com:winfoa/cms-winfoa.git',
      path: '/var/www/winfoa-staging',
      'post-deploy': 'npm install && npm run build:optimize && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': 'apt-get update && apt-get install -y git',
      'post-setup': 'ls -la',
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
};

// =============================================================================
// ADVANCED PM2 CONFIGURATION
// =============================================================================

/**
 * PM2 Configuration Options
 * 
 * Environment Variables:
 * - NODE_ENV: Environment (production/development)
 * - PORT: Application port
 * - HOSTNAME: Application hostname
 * - NEXT_TELEMETRY_DISABLED: Disable Next.js telemetry
 * 
 * Performance Settings:
 * - instances: 'max' uses all available CPUs
 * - exec_mode: 'cluster' for load balancing
 * - max_memory_restart: Restart if memory exceeds limit
 * - restart_delay: Delay before restarting
 * - max_restarts: Maximum restart attempts
 * 
 * Monitoring:
 * - health_check_url: URL for health checks
 * - log_file: Log file location
 * - log_date_format: Log timestamp format
 * 
 * Resource Management:
 * - kill_timeout: Graceful shutdown timeout
 * - wait_ready: Wait for ready signal
 * - listen_timeout: Port binding timeout
 */

/**
 * Usage Instructions:
 * 
 * Development:
 * pm2 start ecosystem.config.js --env development
 * 
 * Production:
 * pm2 start ecosystem.config.js --env production
 * 
 * Monitoring:
 * pm2 monit
 * pm2 logs
 * pm2 status
 * 
 * Deployment:
 * pm2 deploy production
 * pm2 deploy staging
 * 
 * Management:
 * pm2 restart all
 * pm2 reload all
 * pm2 stop all
 * pm2 delete all
 */

module.exports = {
  apps: module.exports.apps,
  deploy: module.exports.deploy,
};