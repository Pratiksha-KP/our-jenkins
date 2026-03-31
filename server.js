const express = require("express");
const app = express();
const { startScheduler } = require("./services/scheduler");  // ← this line must be here

app.use(express.json());

const jobRoutes = require("./routes/jobs");
app.use("/jobs", jobRoutes);

startScheduler();  // ← and this line

app.listen(3000, () => {
  console.log("Server running on port 3000");
});