module.exports = {
  apps: [
    {
      name: 'dolamthanhphat-admin',
      script: 'npm',
      args: 'run preview -- --host',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
