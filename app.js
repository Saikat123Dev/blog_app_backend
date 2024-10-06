const express = require("express");
const userRoutes = require("./src/routes/user.routes");
const postRoute = require("./src/routes/post.routes");
const bodyParser = require('body-parser');
const client = require("prom-client");
const responseTime = require("response-time");

const PORT = 8000;
const app = express();

// Create a new Registry instance
const register = new client.Registry();

// Collect default metrics and register them with the created register
client.collectDefaultMetrics({ register });

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies

// Create the histogram
const reqResTime = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // in seconds
});

// Register the histogram
register.registerMetric(reqResTime);

app.use(
  responseTime((req, res, time) => {
    if (req.url !== '/metrics' && req.url !== '/debug') {
      console.log(`Recording metric for ${req.method} ${req.url}`);
      reqResTime.labels({
        method: req.method,
        route: req.route ? req.route.path : req.url,
        status_code: res.statusCode,
      }).observe(time / 1000); // Convert time to seconds
    }
  })
);

// Routes
app.use('/api', userRoutes);
app.use('/post', postRoute);

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.send(metrics);
});

// Debug route
app.get('/debug', async (req, res) => {
  try {
    console.log('Raw histogram data:', reqResTime);
    const histogramData = await reqResTime.get();
    console.log('Histogram data:', histogramData);
    res.json({
      raw: JSON.parse(JSON.stringify(reqResTime)),
      get: histogramData,
      hashMap: reqResTime.hashMap
    });
  } catch (error) {
    console.error('Error retrieving histogram data:', error);
    res.status(500).json({ error: 'Failed to retrieve histogram data' });
  }
});

// Test route
app.get('/test', (req, res) => {
  setTimeout(() => {
    res.json({ message: 'Test successful' });
  }, Math.random() * 1000);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});