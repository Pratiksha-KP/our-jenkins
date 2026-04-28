const express = require("express");
const app = express();
const { startScheduler } = require("./services/scheduler");  // ← this line must be here

app.use(express.json());
const path = require("path");
app.use(express.static(path.join(__dirname)));

const jobRoutes = require("./routes/jobs");
app.use("/jobs", jobRoutes);

startScheduler();  // ← start the scheduler after routes are set up

app.listen(3000, () => {
  console.log("Server running on port 3000");
});