const express = require('express');
const client = require('prom-client');

const app = express();
const port = 3000;

// Initialize Prometheus metrics
client.collectDefaultMetrics();
const register = client.register;

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
