const express = require("express");
const path = require("path");
const pulls = require("./db/db.json");
const fs = require("fs");
const uuid = require("./helpers/uuid");

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

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      review_id: uuid(),
    };

    const noteString = JSON.stringify(newNote);

    fs.readFile(`./db/db.json`, "utf8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const parsedData = JSON.parse(data);

        parsedData.push(newNote);

        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedData, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated notes")
        );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);

    res.json(response);
  } else {
    res.json("Error");
  }
});

// delete routes
app.delete("/api/notes", (req, res) => {
  console.info(`${req.method} request received`);
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
