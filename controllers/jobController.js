const jobService = require("../services/jobService");

exports.createJob = (req, res) => {
  const { repo, branch } = req.body;

  const job = jobService.createJob(repo, branch);

  res.status(201).json(job);
};

exports.getJobs = (req, res) => {
  res.json(jobService.getAllJobs());
};

exports.getJobById = (req, res) => {
  const job = jobService.getJobById(req.params.id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.json(job);
};