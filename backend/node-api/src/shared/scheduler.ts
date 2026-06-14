// ─────────────────────────────────────────────────────────────────
//  shared/scheduler.js
//  Daily cron jobs — all times IST (UTC+5:30)
//  Add new jobs to the `jobs` array below
// ─────────────────────────────────────────────────────────────────

const cron                = require('node-cron');
const { runPythonScript } = require('./pythonRunner');
const logger              = require('./logger');

const jobs: ScheduledJob[] = [
  {
    name:     'NAV Fetch',
    schedule: '0 22 * * *',       // Daily 10:00 PM IST
    script:   'mutual_fund/fetch_nav_txt.py',
  },
  {
    name:     'NAV Parse & Load',
    schedule: '30 22 * * *',      // Daily 10:30 PM IST
    script:   'mutual_fund/parse_nav_txt.py',
  },
  {
    name:     'OHLCV Fetch',
    schedule: '0 16 * * 1-5',     // Weekdays 4:00 PM IST
    script:   'market_data/ohlcv_fetcher.py',
  },
  {
    name:     'FII/DII Data',
    schedule: '0 17 * * 1-5',     // Weekdays 5:00 PM IST
    script:   'market_data/fii_dii_fetcher.py',
  },
  {
    name:     'MMI Score',
    schedule: '0 18 * * 1-5',     // Weekdays 6:00 PM IST
    script:   'market_data/mmi_fetcher.py',
  },
];

function init() {
  if (process.env.NODE_ENV === 'test') {
    logger.info('[Scheduler] Disabled in test environment');
    return;
  }

  jobs.forEach((job) => {
    cron.schedule(job.schedule, async () => {
      logger.info(`[Scheduler] Starting: ${job.name}`);
      try {
        const output = await runPythonScript(job.script);
        logger.info(`[Scheduler] Completed: ${job.name} → ${output}`);
      } catch (err) {
        logger.error(`[Scheduler] Failed: ${job.name} → ${err.message}`);
      }
    });
    console.info(`[Scheduler] Registered: ${job.name} (${job.schedule})`);
  });
}

module.exports = { init };
