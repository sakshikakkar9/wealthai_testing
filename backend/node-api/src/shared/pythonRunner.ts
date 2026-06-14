// ─────────────────────────────────────────────────────────────────
//  shared/pythonRunner.js
//  Spawns Python scripts from Node.js
//  Usage: const { runPythonScript } = require('../../shared/pythonRunner');
//         await runPythonScript('mutual_fund/fetch_nav_txt.py');
//         await runPythonScript('algo/engine.py', ['--deployment-id', id]);
// ─────────────────────────────────────────────────────────────────

const { spawn } = require('child_process');
const path      = require('path');
const logger    = require('./logger');

const PYTHON_PATH    = process.env.PYTHON_PATH    || 'python3';
const PYTHON_API_DIR = process.env.PYTHON_API_DIR
  ? path.resolve(process.env.PYTHON_API_DIR)
  : path.join(__dirname, '../../python-api');

/**
 * Run a Python script and return its stdout as a string.
 * @param {string} scriptRelPath - e.g. 'mutual_fund/fetch_nav_txt.py'
 * @param {string[]} args        - Optional CLI args
 * @returns {Promise<string>}
 */
function runPythonScript(scriptRelPath: string, args: string[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(PYTHON_API_DIR, scriptRelPath);
    logger.info(`[Python] Running: ${scriptPath}`);

    const proc: ChildProcess = spawn(PYTHON_PATH, [scriptPath, ...args]);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => { stdout += data.toString(); });
    proc.stderr.on('data', (data) => { stderr += data.toString(); });

    proc.on('close', (code) => {
      if (code === 0) {
        logger.info(`[Python] Completed: ${scriptRelPath}`);
        resolve(stdout.trim());
      } else {
        logger.error(`[Python] Failed [${scriptRelPath}]: ${stderr}`);
        reject(new Error(stderr.trim() || `Script exited with code ${code}`));
      }
    });

    proc.on('error', (err) => {
      logger.error(`[Python] Spawn error: ${err.message}`);
      reject(err);
    });
  });
}

module.exports = { runPythonScript };
