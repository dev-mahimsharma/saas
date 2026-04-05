const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/users");
const logger = require("./middleware/logger");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`REST API listening on http://localhost:${port}`);
});
