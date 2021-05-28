require('dotenv').config();
const mysql = require('mysql2/promise');


const seed = async () => {

    try {
        conn = await mysql.createConnection(
            {
                host: 'localhost',
                port: 3306,
                database: process.env.DB_NAME,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
            });


        const [rows, fields] = await conn.execute(
            'SOURCE ./seed/schema.sql;');

            console.log(rows, fields);


    } catch (err) {
        console.log(err);
    }
}

seed()