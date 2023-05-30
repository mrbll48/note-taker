const express = require("express");
const path = require("path");
const app = express();
const PORT = 3001;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// app.get("/api/notes", (req, res) => {
//   res.json(`${req.method} request received to add notes`);
// });

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
