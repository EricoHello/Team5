//app.mjs
import express from 'express';
import bodyParser from 'body-parser'
import { connectToDatabase } from './dbconnect.mjs';
import sql from 'mssql';
import cors from 'cors';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
app.use(cors())
const port = 1234;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

let pool = await connectToDatabase();

app.set('view engine', 'ejs');

app.get('/api/quiz/', async (req, res) => {
    try {
        // Query the database for all quiz questions
        const result = await pool.request()
            .query('SELECT * FROM MultipleChoiceQuestions');
        console.log('Sent all quiz questions');
        //send the json response with the quiz questions
        res.json(result.recordset);
    } catch (error) {
        console.error('Error retrieving quiz questions', error);
        res.status(500).send('Error retrieving quiz questions');
    }
});

app.get('/api/quiz/:lesson_id', async (req, res) => {
    try {
        const lessonId = parseInt(req.params.lesson_id, 10);
        // Query the database for quiz questions for the given lesson id
        const result = await pool.request()
            .input('lessonId', sql.Int, lessonId)
            .query('SELECT * FROM MultipleChoiceQuestions WHERE LessonID = @lessonId');
        console.log(`Sent quiz questions for lesson ${lessonId}`);
        //send the json response with the quiz questions
        res.json(result.recordset);
    } catch (error) {
        console.error('Error retrieving quiz questions', error);
        res.status(500).send('Error retrieving quiz questions');
    }
});

app.get('/api/quiz/language/:lang_name', async (req, res) => {
    try {
        const lang_name = req.params.lang_name;
        // Query the database for quiz questions for the given lang_name
        /**
         * Available names:
         * JavaScript
         * Python
         * general
         * SQL
         * HTML_CSS
         */
        const result = await pool.request()
            .input('lang_name', sql.NVarChar, lang_name)
            .query('SELECT * FROM MultipleChoiceQuestions WHERE language = @lang_name');
        console.log(`Sent quiz questions for language ${lang_name}`);
        //send the json response with the quiz questions
        res.json(result.recordset);
    } catch (error) {
        console.error('Error retrieving quiz questions', error);
        res.status(500).send('Error retrieving quiz questions');
    }
});

app.get('/api/discord/messages', async (req, res) => {

    const BOT_TOKEN = process.env.VITE_DISCORD_TOKEN;
    const CHANNEL_ID = process.env.VITE_CHANNEL_ID;

    try {
        const url = `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return res.status(response.status).json({
                error: "Failed to fetch messages",
                details: errorDetails
            });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

app.post('/api/discord/messages', async (req, res) => {
    const { content } = req.body;
    const BOT_TOKEN = process.env.VITE_DISCORD_TOKEN;
    const CHANNEL_ID = process.env.VITE_CHANNEL_ID;

    if (!content) {
        return res.status(400).json({ error: "Message content is required" });
    }

    try {
        const url = `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }) // Send message to Discord
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            return res.status(response.status).json({
                error: "Failed to send message",
                details: errorDetails
            });
        }

        const data = await response.json();
        res.json({ message: "Message sent successfully", data });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        let pool = await connectToDatabase();
        const result = await pool
            .request()
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, password)
            .query("SELECT id FROM Users WHERE email = @email AND password = @password");

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({ id: result.recordset[0].id });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        if (!email.includes("@")) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }

        let pool = await connectToDatabase();

        const insertResult = await pool
            .request()
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, password)
            .query("INSERT INTO Users (email, password) OUTPUT INSERTED.id VALUES (@email, @password)");

        res.json({ id: insertResult.recordset[0].id });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Fetch the latest challenge
app.get("/api/daily-challenge", async (req, res) => {
    try {
        let pool = await connectToDatabase(); // Use connection pool
        const result = await pool
            .request()
            .query("SELECT TOP 1 * FROM Challenges ORDER BY created_at DESC");

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "No challenges found in the database" });
        }

        res.json(result.recordset[0]); // Return the latest challenge
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Error fetching challenge", details: err.message });
    }
});

app.get("/api/projects", async (req, res) => {
    try {
        let pool_result = await connectToDatabase();
        const pool = await pool_result;
        const result = await pool.request().query("SELECT * FROM Projects");
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Error fetching projects" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//queryDatabase();
