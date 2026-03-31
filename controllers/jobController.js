const jobService = require("../services/jobService");

exports.createJob = (req, res) => {
  const { repo, branch, language } = req.body;
  const job = jobService.createJob(repo, branch, language || "generic");
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

exports.handleWebhook = (req, res) => {
  const payload = req.body;

  // GitHub ping event (sent when webhook is first added)
  if (req.headers["x-github-event"] === "ping") {
    console.log("GitHub webhook ping received!");
    return res.status(200).json({ message: "pong" });
  }

  // Only handle push events
  if (req.headers["x-github-event"] !== "push") {
    return res.status(200).json({ message: "Event ignored" });
  }

  const repo   = payload.repository?.full_name || "unknown/repo";
  const branch = (payload.ref || "refs/heads/main").replace("refs/heads/", "");
  const commits = payload.commits || [];

  // Auto-detect language from repo name + commit messages
  const language = jobService.detectLanguage(repo, commits);

  console.log(`Webhook received: push to ${repo}/${branch}, detected lang: ${language}`);

  const job = jobService.createJob(repo, branch, language);
  res.status(200).json({ received: true, jobId: job.id, language });
};