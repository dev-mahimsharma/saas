const express = require("express");
const cors = require("cors");
const config = require("./config");
const apiRoutes = require("./routes/api");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
});
