// services/scheduler.js
const jobs = require('../models/jobStore');
const { assignWorker } = require('./workerPool');

function startScheduler() {
  setInterval(() => {
    const queued = jobs.filter(j => j.status === 'QUEUED');

    for (const job of queued) {
      const worker = assignWorker(job.language || 'generic');
      if (!worker) continue; // all workers busy

      worker.busy = true;
      job.status = 'RUNNING';
      job.workerId = worker.id;

      // Simulate random execution time (2–6 seconds)
      const duration = 2000 + Math.random() * 4000;

      setTimeout(() => {
        // Random success/failure
        job.status = Math.random() > 0.2 ? 'SUCCESS' : 'FAILED';
        job.finishedAt = new Date();
        worker.busy = false;
      }, duration);
    }
  }, 3000); // poll every 3 seconds
}

module.exports = { startScheduler };