const express = require("express");
const path = require("path");
const pulls = require("./db/db.json");

const app = express();

const PORT = 3001;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// get routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  console.info(`${req.method} request received`);
});

app.get("/api/notes", (req, res) => {
  res.json(pulls);
  console.info(`${req.method} request received`);
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
  console.info(`${req.method} request failed, returning to main page`);
});

// post routes
app.post("/api/notes", (req, res) => {
  res.json(`${req.method} request received`);
  console.info(`${req.method} request received`);
  console.info(req.body);
});

// delete routes
app.delete("/api/notes", (req, res) => {
  console.info(`${req.method} request received`);
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
