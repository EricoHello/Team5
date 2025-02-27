import { connectToDatabase } from './dbconnect.mjs';

export async function queryDatabase() {
  try {
    let pool = await connectToDatabase();
    let result = await pool.request().query('SELECT * FROM MultipleChoiceQuestions');
    console.log(result.recordset); // Output the results
  } catch (err) {
    console.error('Query failed: ', err);
  }
}
