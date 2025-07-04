module.exports = {
  apps: [
    {
      name: 'banedonv',
      script: 'dist/server.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        SERVER_PORT: 3001,
        FRONTEND_BUILD_PATH: './dist/frontend',
        API_BASE_PATH: '/api'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
        SERVER_PORT: 3001,
        FRONTEND_BUILD_PATH: './dist/frontend',
        API_BASE_PATH: '/api',
        LOG_LEVEL: 'debug'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        SERVER_PORT: 3001,
        FRONTEND_BUILD_PATH: './dist/frontend',
        API_BASE_PATH: '/api',
        LOG_LEVEL: 'error'
      },
      // Logging
      log_file: './logs/app.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      
      // Monitoring
      monitoring: false,
      
      // Source maps
      source_map_support: true,
      
      // Watch and ignore
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'dist/frontend']
    }
  ]
};
