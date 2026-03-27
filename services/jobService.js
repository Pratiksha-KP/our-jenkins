const { v4: uuidv4 } = require("uuid");
const jobs = require("../models/jobStore");
const { extractStages } = require("./parserService");

exports.createJob = (repo, branch) => {
  const id = uuidv4();

  // For now: fake Jenkinsfile content
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
    status: "QUEUED",
    stages,
    createdAt: new Date()
  };

  jobs.push(job);

  return job;
};

exports.getAllJobs = () => jobs;

exports.getJobById = (id) => jobs.find(j => j.id === id);