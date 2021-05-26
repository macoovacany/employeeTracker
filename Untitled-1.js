
// get the promise implementation, we will use bluebird
// const bluebird = require('bluebird');

// create the connection, specify bluebird as Promise}

// query database
const main = async () => {

    const conn = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            port: 3306,
            password: '',
            database: 'EMPLOYEE_TRACKER_DB',
        });


    const [rows, fields] = await conn.execute(
        `SELECT DEPARTMENT_NAME, count(roles.department_id)
    FROM departments left join roles 
 ON departments.id = roles.department_id
 GROUP BY DEPARTMENT_NAME;`
    );

    console.log(rows)
}

main()