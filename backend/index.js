const express = require("express");
const app = express();
const path = require("path");
const port = 8080;

const MAX_HISTORY_PER_URL = 100; // ~50 minutes at 30s intervals
const MONITORED_URLS = [
  "https://jakeesperson.com",
  "https://rookie-play.jakeesperson.com",
  "https://scuacm.com",
  "https://hackforhumanity.io"
];

let statusHistory = {
  websites: [],
  // websites: [
  //   {
  //     url: 'http://example.com',
  //     currentStatus: { timestamp: '...', status: 200, isHealthy: true, healthStatus: 'healthy', responseTime: 123, error: null },
  //     history: [{ timestamp: '...', status: 200, isHealthy: true, healthStatus: 'healthy', responseTime: 123, error: null }, ...]
  //   }
  // ]
};

function categorizeHealth(status, error) {
  if (error || status === null) {
    return { isHealthy: false, healthStatus: "Down" };
  }
  if (status >= 200 && status < 300) {
    return { isHealthy: true, healthStatus: "Healthy" };
  }
  if (status >= 300 && status < 400) {
    return { isHealthy: false, healthStatus: "Degraded" };
  }
  return { isHealthy: false, healthStatus: "Down" };
}

function updateStatusHistory(url, status, responseTime, error = null) {
  let website = statusHistory.websites.find(w => w.url === url);
  if (!website) {
    website = {
      url: url,
      currentStatus: null,
      history: [],
    };
    statusHistory.websites.push(website);
  }

  const timestamp = new Date().toISOString();
  const health = categorizeHealth(status, error);
  const newStatus = {
    timestamp,
    status,
    isHealthy: health.isHealthy,
    healthStatus: health.healthStatus,
    responseTime: responseTime,
    error,
  };

  website.currentStatus = newStatus;
  website.history.push(newStatus);

  if (website.history.length > MAX_HISTORY_PER_URL) {
    website.history = website.history.slice(-MAX_HISTORY_PER_URL);
  }
}

async function checkWebsiteStatus(url) {
  const startTime = Date.now();
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
    });
    return {
      url,
      status: response.status,
      responseTime: Date.now() - startTime,
      error: null,
    };
  } catch (error) {
    return {
      url,
      status: null,
      responseTime: Date.now() - startTime,
      error: error.message,
    };
  }
}

async function checkAllWebsites() {
  for (const url of MONITORED_URLS) {
    const result = await checkWebsiteStatus(url);
    updateStatusHistory(
      result.url,
      result.status,
      result.responseTime,
      result.error,
    );
  }
}

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/get-status-history", (req, res) => {
  res.status(200).json(statusHistory);
});

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.get("/{*splat}", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  checkAllWebsites();
  setInterval(checkAllWebsites, 30000);
});
