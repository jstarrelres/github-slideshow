const DAY_IN_MS = 24 * 60 * 60 * 1000;

function parseTimestamp(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function inNormalRange(value, range) {
  if (!range) return true;
  if (typeof range.min === 'number' && value < range.min) return false;
  if (typeof range.max === 'number' && value > range.max) return false;
  return true;
}

function inCriticalRange(value, range) {
  if (!range) return true;
  if (typeof range.min === 'number' && value < range.min) return false;
  if (typeof range.max === 'number' && value > range.max) return false;
  return true;
}

function summarizeByIndicator(readings) {
  const accumulator = {};

  readings.forEach((reading) => {
    Object.entries(reading.indicators || {}).forEach(([indicator, value]) => {
      if (typeof value !== 'number') return;

      if (!accumulator[indicator]) {
        accumulator[indicator] = {
          sum: 0,
          count: 0,
          min: value,
          max: value,
        };
      }

      const current = accumulator[indicator];
      current.sum += value;
      current.count += 1;
      current.min = Math.min(current.min, value);
      current.max = Math.max(current.max, value);
    });
  });

  const summary = {};
  Object.entries(accumulator).forEach(([indicator, stats]) => {
    summary[indicator] = {
      average: Number((stats.sum / stats.count).toFixed(2)),
      min: stats.min,
      max: stats.max,
    };
  });

  return summary;
}

function getOverallStatus(lastReading, indicatorRanges) {
  const outsideRange = [];
  let critical = false;

  Object.entries(lastReading.indicators || {}).forEach(([indicator, value]) => {
    if (typeof value !== 'number') return;

    const range = indicatorRanges[indicator] || {};
    const normalRange = range.normal;
    const criticalRange = range.critical;

    if (!inNormalRange(value, normalRange)) {
      outsideRange.push(indicator);
    }

    if (!inCriticalRange(value, criticalRange)) {
      critical = true;
    }
  });

  if (critical) return { status: 'crítico', outsideRange };
  if (outsideRange.length > 0) return { status: 'atenção', outsideRange };
  return { status: 'normal', outsideRange };
}

function buildDailyReport(station, now = new Date()) {
  const stationReadings = station.readings || [];
  const nowDate = now instanceof Date ? now : new Date(now);
  const lowerBound = nowDate.getTime() - DAY_IN_MS;

  const readingsInWindow = stationReadings
    .map((reading) => ({ ...reading, parsedTimestamp: parseTimestamp(reading.timestamp) }))
    .filter((reading) => reading.parsedTimestamp && reading.parsedTimestamp.getTime() >= lowerBound)
    .sort((a, b) => a.parsedTimestamp.getTime() - b.parsedTimestamp.getTime());

  if (readingsInWindow.length === 0) {
    return null;
  }

  const lastReading = readingsInWindow[readingsInWindow.length - 1];
  const indicatorRanges = station.indicatorRanges || {};
  const { status, outsideRange } = getOverallStatus(lastReading, indicatorRanges);

  return {
    station_id: station.station_id,
    readings_count: readingsInWindow.length,
    indicators: summarizeByIndicator(readingsInWindow),
    last_reading: {
      timestamp: lastReading.timestamp,
      indicators: lastReading.indicators,
    },
    overall_status: status,
    indicators_out_of_range: outsideRange,
  };
}

module.exports = {
  buildDailyReport,
};
