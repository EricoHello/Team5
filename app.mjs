//app.mjs
import express from 'express';
import bodyParser from 'body-parser'
import { connectToDatabase } from './dbconnect.mjs';

const app = express();
const port = 1234;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

let pool = await connectToDatabase();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { title: 'Home', message: 'Welcome to Learn2Code!' });
});

app.get('/quiz', async (req, res) => {
    try {
        // Query the database for quiz questions
        const result = await pool.request().query(`SELECT * FROM MultipleChoiceQuestions`);
        console.log(result.recordset);
        // Pass the quiz questions to the view
        res.render('quiz', { questions: result.recordset });
    } catch (error) {
        res.status(500).send('Error retrieving quiz questions');
    }
});

app.post('/submit-quiz', async (req, res) => {
    const result = await pool.request().query('SELECT * FROM MultipleChoiceQuestions');
    const questions = result.recordset;
    const answers = req.body;

    res.render('submit-quiz', { questions, answers });
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
