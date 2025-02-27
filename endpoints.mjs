// endpoints.mjs
import express from 'express';
import { connectToDatabase } from './dbconnect.mjs';

const app = express();
const port = 1234;

app.get('/api/questions', async (req, res) => {
  try {
    let pool = await connectToDatabase();
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
