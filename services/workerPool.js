// services/workerPool.js
const workers = [
  { id: 'w1', type: 'node',    busy: false },
  { id: 'w2', type: 'python',  busy: false },
  { id: 'w3', type: 'java',    busy: false },
  { id: 'w4', type: 'generic', busy: false },
];

// Find a free worker matching the job's language, else any free worker
function assignWorker(jobLanguage) {
  return workers.find(w => !w.busy && w.type === jobLanguage)
      || workers.find(w => !w.busy);
}

module.exports = { workers, assignWorker };