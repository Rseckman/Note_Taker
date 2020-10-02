const path = require("path");
const express = require("express");
const app = express();
const fsPromises = require('fs').promises;

const PORT = process.env.PORT || 8000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Routes

app.get("/api/notes/", async function(req, res) {
    const db = JSON.parse(await fsPromises.readFile('./db/db.json', 'utf8'));
    
    return res.json(db);
});

// POST /api/notes

app.post("/api/notes/", async function(req, res) {
    // req.body = {title: something, text: something, id: something}
    let body = req.body;
    body.id = Math.floor(Math.random() * 1000)
    console.log(body);
    let databaseObj = JSON.parse(await fsPromises.readFile("./db/db.json", "utf8"));
    console.log(databaseObj);
    databaseObj.push(body);
    await fsPromises.writeFile("./db/db.json", JSON.stringify(databaseObj));
    return res.status(200).end();
});

// DELETE /api/notes/:id
app.delete('/api/notes/:id', async (req, res) => { 
    const id = parseInt(req.params.id);

    let databaseObj = JSON.parse(await fsPromises.readFile("./db/db.json", "utf8"));
    
    let deletedNote;
    
    let updatedData = databaseObj.filter(note => {
        if (note === id) {
            deletedNote = note;
        }

        return note.id !== id;
    });

    await fsPromises.writeFile("./db/db.json", JSON.stringify(updatedData));
    
    if (!deletedNote) {
        res.send(`Note ${id} not found`);

        return;
    }
    
    res.send(`Deleted note ${deletedNote}`);
}) 

// HTML Routes
app.use(express.static("public"));

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// GET * => index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});



app.listen(PORT, ()=> {
    console.log(`server is running on http://localhost:${PORT}/`);
});