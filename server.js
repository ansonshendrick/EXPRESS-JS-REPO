const express = require('express');
const path = require('path');
const fs = require("fs");
const uuid = require('./helpers/uuid');

const app = express();
const PORT = 3002;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => res.send('Navigate to /notes or /routes'));
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// GET request for retrieving all notes
app.get('/api/notes', (req, res) => {
  // Read the data from db.json file
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json('Error in retrieving notes');
    } else {
      // Parse the JSON data into an array
      const notes = JSON.parse(data);
      res.status(200).json(notes);
    }
  });
});

// POST request to add a new note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the note properties in req.body
  const { title, text } = req.body;

  // If both the title and description are present
  if (title && description) {
    // Create a new note object with a unique id
    const newNote = {
      id: uuid(),
      title,
      text,
    };

    // Read the existing notes from db.json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json('Error in adding note');
      } else {
        // Parse the JSON data into an array
        const notes = JSON.parse(data);

        // Add the new note to the array
        notes.push(newNote);

        // Write the updated notes array back to the file
        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
        );

        const response = {
          status: 'success',
          body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
      }
    });
  } else {
    res.status(400).json('Error: Title and description are required');
  }
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
