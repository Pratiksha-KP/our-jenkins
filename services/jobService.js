const { v4: uuidv4 } = require("uuid");
const jobs = require("../models/jobStore");
const { extractStages } = require("./parserService");

function detectLanguage(repoName = "", commits = []) {
  const text = [repoName, ...commits.map((c) => c.message || "")]
    .join(" ").toLowerCase();
  if (text.includes("python") || text.includes(".py")) return "python";
  if (text.includes("java")   || text.includes(".java")) return "java";
  if (text.includes("node")   || text.includes(".js"))   return "node";
  return "generic";
}

function calculatePriority(branch = "", language = "generic", commits = []) {
  // Factor 1: branch importance
  const branchScores = { main: 3, master: 3, staging: 2, develop: 1, dev: 1 };
  const branchKey = Object.keys(branchScores).find(k => branch.toLowerCase().includes(k));
  const branchScore = branchScores[branchKey] || 1;

  // Factor 2: language (compiled = stricter, prioritize)
  const langScores = { java: 3, node: 2, python: 1, generic: 0 };
  const langScore = langScores[language] || 0;

  // Factor 3: number of commits in push (bigger change = more urgent)
  const commitScore = Math.min(commits.length, 5) * 2; // cap at 5 commits = 10pts

  const total = branchScore + langScore + commitScore;

  console.log(`Priority calc: branch(${branch})=${branchScore} + lang(${language})=${langScore} + commits(${commits.length})=${commitScore} => ${total}`);
  return total;
}

exports.createJob = (repo, branch, language = "generic", commits = []) => {
  const id = uuidv4();

  const fakeJenkinsfile = `
    stage('Build')
    stage('Test')
    stage('Deploy')
  `;

  const stages = extractStages(fakeJenkinsfile);
  const priority = calculatePriority(branch, language, commits);

  const job = {
    id,
    repo,
    branch,
    language,
    priority,
    status: "QUEUED",
    stages,
    workerId: null,
    createdAt: new Date(),
    finishedAt: null,
  };

  jobs.push(job);
  console.log(`Job created: ${id} | repo: ${repo} | branch: ${branch} | lang: ${language} | priority: ${priority}`);
  return job;
};

exports.getAllJobs = () => jobs;
exports.getJobById = (id) => jobs.find((j) => j.id === id);
exports.detectLanguage = detectLanguage;
exports.calculatePriority = calculatePriority;