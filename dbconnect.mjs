import mysql from 'mysql2';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: "na",
    user: "root",
    password: "na",
    database: "learn2code_db",
    port: XXXXX
});

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/lessons', (res) => {
    db.query("SELECT id, title, content, video_url FROM lessons", function (err, result) {
        if (err) throw err;
        res.send(result);
    })
});

app.get('/quiz/:lesson_id', (req, res) => {
    db.query("SELECT id, question, choices, correct_answer FROM quizzes WHERE lesson_id = ?", [req.params.lesson_id], function (err, result) {
        if (err) throw err;
        res.send(result);
    })
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});