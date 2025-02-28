//app.mjs
import express from 'express';
import bodyParser from 'body-parser'
import { connectToDatabase } from './dbconnect.mjs';
import sql from 'mssql';

const app = express();
const port = 1234;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

let pool = await connectToDatabase();

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const result = await pool.request().query('SELECT * FROM Lesson');
    console.log(result.recordset);

    res.render('index', { title: 'Home', message: 'Welcome to Learn2Code!', lessons: result.recordset });
});

app.get('/quiz/:lesson_id', async (req, res) => {
    try {
        const lessonId = parseInt(req.params.lesson_id, 10);
        // Query the database for quiz questions using a parameterized query
        const result = await pool.request()
            .input('lessonId', sql.Int, lessonId)
            .query('SELECT * FROM MultipleChoiceQuestions WHERE LessonID = @lessonId');
        console.log(result.recordset);
        // Pass the quiz questions to the view
        res.render('quiz', { questions: result.recordset, lessonId });
    } catch (error) {
        console.error('Error retrieving quiz questions', error);
        res.status(500).send('Error retrieving quiz questions');
    }
});

app.post('/submit-quiz/:lesson_id', async (req, res) => {
    const lessonId = parseInt(req.params.lesson_id, 10);

    const result = await pool.request()
    .input('lessonId', sql.Int, lessonId)
    .query('SELECT * FROM MultipleChoiceQuestions WHERE LessonID = @lessonId');
    const questions = result.recordset;
    const answers = req.body;
    res.render('submit-quiz', { questions, answers });
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//queryDatabase();
