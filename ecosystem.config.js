module.exports = {
  apps: [
    {
      name: "cah-terminal",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/cah-terminal",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
