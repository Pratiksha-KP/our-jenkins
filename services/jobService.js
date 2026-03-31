const { v4: uuidv4 } = require("uuid");
const jobs = require("../models/jobStore");
const { extractStages } = require("./parserService");

// Guess language from repo name or commit messages
function detectLanguage(repoName = "", commits = []) {
  const text = [
    repoName,
    ...commits.map((c) => c.message || ""),
  ]
    .join(" ")
    .toLowerCase();

  if (text.includes("python") || text.includes(".py")) return "python";
  if (text.includes("java")   || text.includes(".java")) return "java";
  if (text.includes("node")   || text.includes(".js"))   return "node";
  return "generic";
}

exports.createJob = (repo, branch, language = "generic") => {
  const id = uuidv4();

  const fakeJenkinsfile = `
    stage('Build')
    stage('Test')
    stage('Deploy')
  `;

  const stages = extractStages(fakeJenkinsfile);

  const job = {
    id,
    repo,
    branch,
    language,
    status: "QUEUED",
    stages,
    workerId: null,
    createdAt: new Date(),
    finishedAt: null,
  };

  jobs.push(job);
  console.log(`Job created: ${id} | repo: ${repo} | lang: ${language}`);
  return job;
};

exports.getAllJobs = () => jobs;
exports.getJobById = (id) => jobs.find((j) => j.id === id);
exports.detectLanguage = detectLanguage;