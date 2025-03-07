import 'dotenv/config';

export const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        enableArithAbort: process.env.DB_ARITHABORT === "true"
    }
};