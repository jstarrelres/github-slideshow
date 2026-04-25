const http = require('http');
const fs = require('fs');
const path = require('path');
const { buildDailyReport } = require('./daily-report');

const DATA_PATH = path.join(__dirname, 'data', 'readings.json');
const PORT = process.env.PORT || 3000;

function loadStations() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload, null, 2));
}

function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  const match = url.pathname.match(/^\/daily-report\/([^/]+)$/);
  if (!match) {
    return sendJson(res, 404, { error: 'Not Found' });
  }

  const stationId = decodeURIComponent(match[1]);
  const stations = loadStations();
  const station = stations.find((item) => item.station_id === stationId);

  if (!station) {
    return sendJson(res, 404, { error: `Station '${stationId}' not found` });
  }

  const report = buildDailyReport(station);
  if (!report) {
    return sendJson(res, 404, { error: 'No readings in the last 24h' });
  }

  return sendJson(res, 200, report);
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = {
  server,
  handleRequest,
};
