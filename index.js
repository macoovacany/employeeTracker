const inq = require('inquirer');
const process = require('process');

// https://github.com/sidorares/node-mysql2#using-promise-wrapper
const mysql = require('mysql2/promise');
// conn is going to be kept open throughout the interface with the menus
var conn;   // global connection 



// create, read, update and delete queries are called
// add,    view, modify and remove

// **************************
// Department queries
// **************************

const addDepartment = async () => {
    console.clear()
    try {
        const ans = await inq.prompt([
            {
                type: 'input',
                name: 'addDepartment',
                message: 'Add a new department, or enter to bail.'
            }
        ]);

        // 
        let newDepartment = ans.addDepartment.replace(/\s/g, '');
        if (newDepartment) {
            const [rows, fields] = await conn.execute(
                'INSERT INTO DEPARTMENTS (DEPARTMENT_NAME) VALUES (?);',
                [newDepartment]);

            // results are OK
            if (rows.affectedRows === 1) {
                returnStr = `Added ${newDepartment}.\n`;
                departmentMenu(() => { console.clear(); console.log(returnStr); });
            }
        } else {
            departmentMenu(() => 'No update to departments.');
        }
    } catch (err) {
        switch (err.errno) {
            case 1062:
                departmentMenu(() => {
                    console.clear(); console.log('Department already exists.');
                });
                break;
            default:
                console.log(err.errno);
                Quit();
        }
    }
};


const viewDepartments = async () => {
    try {
        const [rows, fields] = await conn.execute(
            `SELECT DEPARTMENT_NAME, count(roles.department_id)
           FROM departments left join roles 
        ON departments.id = roles.department_id
        GROUP BY DEPARTMENT_NAME;`
        );

        departmentMenu(() => { console.clear(); console.table(rows); });


    } catch (err) {
        throw err;
    }
}


// meaningless action for departments 
// const modifyDepartments = () => {}


const removeDepartments = async () => {
    console.clear()
    let removeDepartment = ''; // referenced in catch block

    try {
        const [results, fields_1] = await conn.execute(
            'SELECT * FROM DEPARTMENTS;');

        departmentList = results.map(element => {
            return element.DEPARTMENT_NAME;
        });

        const ans = await inq.prompt([
            {
                type: 'list',
                name: 'removeDepartmentSelection',
                message: 'Which department do you want to remove?',
                choices: departmentList
            }]);

        removeDepartment = ans.removeDepartmentSelection;

        const [rows, fields_2] = await conn.execute(
            'DELETE FROM DEPARTMENTS WHERE DEPARTMENT_NAME = ?;',
            [removeDepartment]);

        if (rows.affectedRows === 1) {
            returnStr = `Removed ${removeDepartment}.\n`;
            departmentMenu(() => { console.clear(); console.log(returnStr); });
        }
    } catch (err) {
        switch (err.errno) {
            case 1451:
                returnStr = `Cannot remove department '${removeDepartment}'. \n Remove associated roles first.`
                departmentMenu(() => {
                    console.clear(); console.log(returnStr);
                });
                break;
            default:
                console.log(err.errno);
                Quit();
        }
    }
};



// **************************
// Role queries
// **************************

const addRole = async () => {
    console.clear()
    inq.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: 'You need to input a value for addRole'
        }
    ])
        .then((ans) => {
            console.log(ans)
            rolesMenu();
        });
};

const viewRoles = async () => {
    console.clear()
    conn.query(
        `select  departments.department_name, roles.title, 
        (SELECT COUNT(*) FROM employees WHERE roles.ID = employees.ROLES_ID ) as EmployeeCount
   from roles
   inner join departments  
   on departments.id = roles.department_id;`,
        (err, results, fields) => {
            if (err) { Panic(err) };
            departmentMenu(() => { console.table(results); console.log('\n'); });
        })
};


const modifyRoles = async () => {
    console.log('modifyRoles');
    inq.prompt([
        {
            type: 'input',
            name: 'modifyRoles',
            message: 'You need to input a value for modifyRoles'
        }
    ])
        .then((ans) => {
            console.log(ans)
            rolesMenu();
        });
};


const removeRoles = async () => {
    console.log('removeRoles');
    inq.prompt([
        {
            type: 'input',
            name: 'removeRoles',
            message: 'You need to input a value for removeRoles'
        }
    ])
        .then((ans) => {
            console.log(ans)
            rolesMenu();
        });
};



// **************************
// Role queries
// **************************

const addEmployee = async () => {
    console.log('AddEmployee');
    inq.prompt([
        {
            type: 'input',
            name: 'AddEmployee',
            message: 'You need to input a value for AddEmployee'
        }
    ])
        .then((ans) => {
            console.log(ans)
            employeesMenu();
        });

};

const viewEmployees = async () => {
    console.log('viewEmployees/n/n');
    conn.query(
        'SELECT * FROM EMPLOYEES;',
        (err, results, fields) => {
            if (err) throw err;
            console.table(results);
            employeesMenu();
        });
};

const modifyEmployee = async () => {
    console.log('modifyEmployee');
    inq.prompt([
        {
            type: 'input',
            name: 'modifyEmployee',
            message: 'You need to input a value for modifyEmployee'
        }
    ])
        .then((ans) => {
            console.log(ans)
            employeesMenu();
        });
};

const removeEmployee = async () => {
    console.log('removeEmployee');
    inq.prompt([
        {
            type: 'input',
            name: 'removeEmployee',
            message: 'You need to input a value for removeEmployee'
        }
    ])
        .then((ans) => {
            console.log(ans)
            employeesMenu();
        });
};






// *************************
// Generic reports
// *************************


const viewManagers = async () => {

    console.log('viewManagers');
    inq.prompt([
        {
            type: 'input',
            name: 'viewManagers',
            message: 'You need to input a value for viewManagers'
        }
    ])
        .then((ans) => {
            console.log(ans)
            mainMenu();
        });

};


const ShowSummaries = async () => {

    console.log('ShowSummaries');
    inq.prompt([
        {
            type: 'input',
            name: 'ShowSummaries',
            message: 'You need to input a value for ShowSummaries'
        }
    ])
        .then((ans) => {
            console.log(ans)
            mainMenu();
        });

};




const Panic = (err) => {
    console.log('Panic exit - ')
    throw err;
    // console.log(err);
    // conn.end();
    // process.exit();

}

const Quit = () => {
    console.log('quitting....')
    conn.end();
    process.exit();
}


// *************************
//  * Menu options  ********
// *************************

const rolesMenu = (prevResults) => {
    console.clear();
    console.log(prevResults);

    inq.prompt(
        [{
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to do?',
            choices: [
                { name: 'add role', value: addRole },
                { name: 'view roles', value: viewRoles },
                { name: 'modify a role', value: modifyRoles },
                { name: 'remove Roles', value: removeRoles },
                { name: 'Back to Main Menu', value: mainMenu },
            ]
        },
        ]
    )
        .then((ans) => {
            ans.menuChoice();
        });
}

const departmentMenu = (prevResults = () => { }) => {

    prevResults();
    console.log('********************************************************')
    inq.prompt(
        [{
            type: 'list',
            name: 'menuChoice',
            message: 'Department Actions:',
            choices: [
                { name: 'Add a department', value: addDepartment },
                { name: 'view departments', value: viewDepartments },
                // { name: 'modify a department', value: modifyDepartments },
                { name: 'remove a department', value: removeDepartments },
                { name: 'Back to Main Menu', value: mainMenu },
            ]
        },
        ])
        .then((ans) => {
            ans.menuChoice();
        });
}


const employeesMenu = (prevResults) => {
    console.clear();
    console.log(prevResults);

    inq.prompt(
        [{
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to do?',
            choices: [
                { name: 'Add employee', value: addEmployee },
                { name: 'view employees', value: viewEmployees },
                { name: 'modify employee', value: modifyEmployee },
                { name: 'remove employees', value: removeEmployee },
                { name: 'Back to Main Menu', value: mainMenu },
            ]
        },
        ]
    )
        .then((ans) => {
            ans.menuChoice();
        });
}


const reportsMenu = (prevResults) => {
    console.clear();
    console.log(prevResults);

    inq.prompt(
        [{
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to do?',
            choices: [
                { name: 'View Org Chart', value: viewManagers },
                { name: 'Show summaries', value: ShowSummaries },
                { name: 'Back to Main Menu', value: mainMenu },
            ]
        },
        ]
    )
        .then((ans) => {
            ans.menuChoice();
        });
}

const debugQuery = () => {
    conn.query(
        'SELECT * FROM DEPARTMENTS;',
        (err, results, fields) => {
            if (err) throw err;
            departmentList = results.map(element => {
                return element.DEPARTMENT_NAME;
            });
            inq.prompt([
                {
                    type: 'list',
                    name: 'removeDepartmentSelection',
                    message: 'Which department do you want to remove?',
                    choices: departmentList
                }])
                .then((ans) => {
                    conn.query(
                        'DELETE FROM DEPARTMENTS WHERE DEPARTMENT_NAME = ?;',
                        ans.removeDepartmentSelection,
                        (err, results, fields) => {
                            if (err) throw err;
                        }
                    )
                });
        })
};


const mainMenu = (prevResults) => {
    console.clear();
    console.log(prevResults);

    inq.prompt(
        [
            {
                type: 'list',
                name: 'menuChoice',
                message: 'What would you like to do?',
                choices: [
                    { name: 'Department queries', value: departmentMenu },
                    { name: 'Roles queries', value: rolesMenu },
                    { name: 'Employees queries', value: employeesMenu },
                    { name: 'Reports queries', value: reportsMenu },
                    { name: 'Debug Query', value: debugQuery },
                    { name: 'Quit', value: Quit },
                ]
            },
        ]
    )
        .then((ans) => {
            ans.menuChoice();
        });
}



const main = async () => {

    try {
        conn = await mysql.createConnection(
            {
                host: 'localhost',
                user: 'root',
                port: 3306,
                password: '',
                database: 'EMPLOYEE_TRACKER_DB',
            });


        const [rows, fields] = await conn.execute(
            'SELECT COUNT(*) as numEmployees FROM EMPLOYEES;')

        const numEmployees = rows[0].numEmployees;

        mainMenu(`
        **********************************
        Employee and Department Maagement
        *********************************

        Connected to database with ${numEmployees} employees.
        `);

    } catch (err) {
        console.log(err)
    }
}

main()