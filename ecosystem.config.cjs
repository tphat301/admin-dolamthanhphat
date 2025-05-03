module.exports = {
  apps: [
    {
      name: 'dolamthanhphat-admin',
      script: 'npm',
      args: 'run preview -- --host --port 3003',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
