// index.mjs
import express from 'express';
import { connectToDatabase } from './dbconnect.mjs';

const app = express();
const port = 1234;

let pool = await connectToDatabase();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { title: 'Home', message: 'Welcome to Learn2Code!' });
});

app.get('/quiz', async (req, res) => {
    try {
        // Query the database for quiz questions
        const result = await pool.request().query(`SELECT * FROM MultipleChoiceQuestions`);
        // Pass the quiz questions to the view
        res.render('quiz', { questions: result.recordset });
    } catch (error) {
        res.status(500).send('Error retrieving quiz questions');
    }
});

app.get('/api/questions', async (req, res) => {
    try {
        let result = await pool.request().query('SELECT * FROM MultipleChoiceQuestions');
        res.json(result.recordset);
    } catch (err) {
        console.error('Query failed: ', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//queryDatabase();
