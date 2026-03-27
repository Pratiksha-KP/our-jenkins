const express = require("express");
const app = express();

app.use(express.json());

const jobRoutes = require("./routes/jobs");
app.use("/jobs", jobRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});