import mysql from 'mysql2';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: "vergil.u.washington.edu",
    user: "root",
    password: "I118whenB210",
    database: "learn2code_db",
    port: 12455
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/lessons', (res) => {
    connection.query("SELECT id, title, content, video_url FROM lessons", function(err, result) {
        if (err) throw err;
        res.send(result);
    })
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});