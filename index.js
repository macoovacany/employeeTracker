const inq = require('inquirer');
const process = require('process');
const mysql = require('mysql2');

// conn is going to be kept open throughout the interface with the menus
const conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'EMPLOYEE_TRACKER_DB',
});



// create, read, update and delete queries are called
// add,    view, modify and remove

// **************************
// Department queries
// **************************

const addDepartment = () => {
    console.clear()
    inq.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'Add a new department, or enter to bail.'
        }
    ])
        .then((ans) => {
            console.log(ans);
            // 
            let newDepartment = ans.addDepartment.replace(/\s/g, '');
            if (newDepartment) {
                conn.query(
                    'INSERT INTO DEPARTMENTS (DEPARTMENT_NAME) VALUES (?);',
                    newDepartment,
                    (err, results, fields) => {
                        console.log(err);

                        // error handling
                        if (err) {
                            switch (err.code) {
                                case 'ER_DUP_ENTRY':
                                    returnStr = `${newDepartment} already exists. No update to departments.`;
                                    departmentMenu(() => { console.log(returnStr); });
                                    break;
                                default:
                                    throw err;
                            }
                        }

                        // results are OK
                        if (results.affectedRows === 1) {
                            returnStr = `Added ${newDepartment}.\n`;
                            departmentMenu(() => { console.log(returnStr); });
                        }
                    });
            } else {
                departmentMenu(() => 'No update to departments.');
            }
        });
};


const viewDepartments = () => {
    console.clear()
    conn.query(
        `SELECT DEPARTMENT_NAME, count(roles.department_id)
         FROM departments left join roles 
         ON departments.id = roles.department_id
        GROUP BY DEPARTMENT_NAME;`,
        (err, results, fields) => {
            if (err) { Panic(err) };
            departmentMenu(() => { console.table(results); console.log('\n'); });
        })
};

// meaningless action for departments 
// const modifyDepartments = () => {}


const removeDepartments = () => {
    console.clear()
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
                    let removeDepartment = ans.removeDepartmentSelection;

                    conn.query(
                        'DELETE FROM DEPARTMENTS WHERE DEPARTMENT_NAME = ?;',
                        removeDepartment,
                        (err, results, fields) => {

                            console.log(err);
                            // error handling
                            if (err) {
                                switch (err.code) {
                                    case 'ER_ROW_IS_REFERENCED_2':
                                        returnStr = `${removeDepartment} can not be deleted because it is referenced by some roles.`;
                                        departmentMenu(() => { console.log(returnStr); });
                                        break;
                                    default:
                                        throw err;
                                }
                            }

                            // results ok
                            console.log(results.affectedRows === 1)
                            if (results.affectedRows === 1) {
                                returnStr = `${ans.removeDepartmentSelection} removed`;
                                departmentMenu(() => 'returnStr');
                            } else {
                                // something went wrong...
                                // console.clear()
                                Quit();
                            }
                        }
                    )
                });
        })
};



// **************************
// Role queries
// **************************

const addRole = () => {
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

const viewRoles = () => {
    console.clear()
    conn.query(
        `SELECT roles.title, departments.DEPARTMENT_NAME, count(employees.id)
        FROM departments inner join roles left join employees
        on  roles.DEPARTMENT_ID = departments.ID
            and employees.ROLES_ID = roles.ID
       group by roles.title;`,
        (err, results, fields) => {
            if (err) { Panic(err) };
            departmentMenu(() => { console.table(results); console.log('\n'); });
        })
};


const modifyRoles = () => {
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


const removeRoles = () => {
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

const addEmployee = () => {
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

const viewEmployees = () => {
    console.log('viewEmployees/n/n');
    conn.query(
        'SELECT * FROM EMPLOYEES;',
        (err, results, fields) => {
            if (err) throw err;
            console.table(results);
            employeesMenu();
        });
};

const modifyEmployee = () => {
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

const removeEmployee = () => {
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


const viewManagers = () => {

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


const ShowSummaries = () => {

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
    console.clear();
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
                { name: 'view managers', value: viewManagers },
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


// main entry point - straight into the 
// database checks
// then call the inquirer UI proper
conn.query(
    'SELECT COUNT(*) as numEmployees FROM EMPLOYEES; ',
    (err, results, fields) => {
        if (err) throw err;
        let numEmployees = results[0].numEmployees;

        // enter inqurier mode proper
        mainMenu(`
        **********************************
        Employee and Department Maagement
        *********************************

        Connected to database with ${numEmployees} employeess.
        `);
    })

    // conn.end();

    // .then(() => {
    // });

