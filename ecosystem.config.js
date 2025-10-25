module.exports = {
  apps: [{
    name: "cobra-portal",
    script: "server.js",
    env: {
      PORT: 8080,
      NODE_ENV: "production"
    }
  }]
};
