const assert = require('assert');
const { buildDailyReport } = require('./daily-report');

const station = {
  station_id: 'station-1',
  indicatorRanges: {
    temperature: {
      normal: { min: 10, max: 35 },
      critical: { min: 5, max: 40 },
    },
    humidity: {
      normal: { min: 30, max: 75 },
      critical: { min: 20, max: 85 },
    },
  },
  readings: [
    {
      timestamp: '2026-04-24T16:00:00Z',
      indicators: { temperature: 20, humidity: 60 },
    },
    {
      timestamp: '2026-04-25T12:00:00Z',
      indicators: { temperature: 38, humidity: 80 },
    },
  ],
};

const report = buildDailyReport(station, new Date('2026-04-25T16:00:00Z'));
assert(report, 'Report should not be null');
assert.strictEqual(report.readings_count, 2);
assert.strictEqual(report.indicators.temperature.average, 29);
assert.strictEqual(report.last_reading.indicators.temperature, 38);
assert.strictEqual(report.overall_status, 'atenção');
assert.deepStrictEqual(report.indicators_out_of_range.sort(), ['humidity', 'temperature']);

const emptyReport = buildDailyReport(
  {
    station_id: 'station-2',
    readings: [
      {
        timestamp: '2026-04-20T00:00:00Z',
        indicators: { temperature: 18 },
      },
    ],
  },
  new Date('2026-04-25T16:00:00Z')
);
assert.strictEqual(emptyReport, null);

console.log('daily-report tests passed');
