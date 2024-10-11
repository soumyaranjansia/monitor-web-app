const express = require('express');
const axios = require('axios');
const client = require('prom-client');
const { Counter, Gauge } = client;

// Create an Express app
const app = express();
const port = 3000;

// Create Prometheus metrics
const httpRequestDuration = new Gauge({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['url'],
});

const httpRequestStatus = new Counter({
  name: 'http_request_status_codes',
  help: 'HTTP request status codes',
  labelNames: ['url', 'status_code'],
});

const httpRequestTotal = new Counter({
  name: 'http_request_total',
  help: 'Total number of HTTP requests',
  labelNames: ['url'],
});

const httpRequestErrorTotal = new Counter({
  name: 'http_request_error_total',
  help: 'Total number of HTTP errors',
  labelNames: ['url', 'error_type'],
});

// Monitoring function
async function checkWebPage(url) {
  try {
    const startTime = Date.now();
    const response = await axios.get(url);
    const duration = (Date.now() - startTime) / 1000;

    // Update Prometheus metrics
    httpRequestDuration.set({ url }, duration);
    httpRequestStatus.inc({ url, status_code: response.status });
    httpRequestTotal.inc({ url });

    console.log(`Checked ${url}: ${response.status}, Duration: ${duration}s`);
  } catch (error) {
    const errorType = error.response ? error.response.status : 'NetworkError';
    httpRequestErrorTotal.inc({ url, error_type: errorType });
    httpRequestStatus.inc({ url, status_code: error.response?.status || 500 });
    console.error(`Error checking ${url}: ${error.message}`);
  }
}

// Periodically check a web page
setInterval(() => {
  checkWebPage('https://xyz.com/api/fetchuser'); // Change to your target public api URL
}, 60000); // Every 60 seconds

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
