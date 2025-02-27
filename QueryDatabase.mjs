//QueryDatabase runs queries but doesn't have any endpoints. 
//It's a separate module that's imported into index.mjs and run there.
//Mostly just using it for testing
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
