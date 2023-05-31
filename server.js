const express = require("express");
const path = require("path");
const pulls = require("./db/db.json");
const fs = require("fs");
const uuid = require("./helpers/uuid");
const { v4: uuidv4 } = require("uuid");

const app = express();

const PORT = process.env.PORT || 3001;

// middleware used in application
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sets route to main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// sets route to note taker page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (_, data) => {
    res.json(JSON.parse(data));
  });
});

// route that sends user back to main page if incorrect URL is used
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// post
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

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

    res.json(response);
  } else {
    res.json("Error");
  }
});

// delete routes
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (_, data) => {
    const notes = JSON.parse(data);
    const filteredNotes = notes.filter((note) => note.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(filteredNotes, null, 4));
    res.json(filteredNotes);
  });
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
