const jobs = require("../models/jobStore");
const { assignWorker } = require("./workerPool");

function startScheduler() {
  console.log("Scheduler started, polling every 3 seconds...");

  setInterval(() => {
    const queuedJobs = jobs.filter((j) => j.status === "QUEUED");

    if (queuedJobs.length === 0) return;

    console.log(`Scheduler: ${queuedJobs.length} job(s) in queue`);

    for (const job of queuedJobs) {
      const worker = assignWorker(job.language);

      if (!worker) {
        console.log(`No free worker available for job ${job.id}, will retry...`);
        continue;
      }

      worker.busy = true;
      job.status = "RUNNING";
      job.workerId = worker.id;
      console.log(`Job ${job.id} (${job.language}) assigned to ${worker.id}`);

      const duration = 2000 + Math.random() * 4000;

      setTimeout(() => {
        job.status = Math.random() > 0.2 ? "SUCCESS" : "FAILED";
        job.finishedAt = new Date();
        worker.busy = false;
        console.log(`Job ${job.id} finished with status: ${job.status}`);
      }, duration);
    }
  }, 3000);
}

module.exports = { startScheduler };