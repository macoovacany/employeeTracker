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
    console.log('addDepartment');
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
                        if (err) throw err;
                        console.table(results);
                        departmentMenu();
                    });
            } else {
                console.log('No update to departments.');
                departmentMenu();
            }
            
        });
};


const viewDepartments = () => {
    console.log('viewDepartments');
    inq.prompt([
        {
            type: 'input',
            name: 'viewDepartments',
            message: 'You need to input a value for viewDepartments'
        }
    ])
        .then((ans) => {
            console.log(ans)
            departmentMenu();
        });
};

const modifyDepartments = () => {

    console.log('modifyDepartments');
    inq.prompt([
        {
            type: 'input',
            name: 'modifyDepartments',
            message: 'You need to input a value for modifyDepartments'
        }
    ])
        .then((ans) => {
            console.log(ans)
            departmentMenu();
        });
};


const removeDepartments = () => {
    console.log('removeDepartments');
    inq.prompt([
        {
            type: 'input',
            name: 'removeDepartments',
            message: 'You need to input a value for removeDepartments'
        }
    ])
        .then((ans) => {
            console.log(ans)
            departmentMenu();
        });
};



// **************************
// Role queries
// **************************

const addRole = () => {
    console.log('addRole');
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
    console.log('viewRoles');
    inq.prompt([
        {
            type: 'input',
            name: 'viewRoles',
            message: 'You need to input a value for viewRoles'
        }
    ])
        .then((ans) => {
            console.log(ans)
            rolesMenu();
        });
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




const Quit = () => {
    console.log('quitting....')
    conn.end();
    process.exit();
}


// *************************
//  * Menu options  ********
// *************************

const rolesMenu = () => {
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

const departmentMenu = () => {
    inq.prompt(
        [{
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to do?',
            choices: [
                { name: 'Add a department', value: addDepartment },
                { name: 'view departments', value: viewDepartments },
                { name: 'modify a department', value: modifyDepartments },
                { name: 'remove a department', value: removeDepartments },
                { name: 'Back to Main Menu', value: mainMenu },
            ]
        },
        ]
    )
        .then((ans) => {
            ans.menuChoice();
        });
}


const employeesMenu = () => {
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


const reportsMenu = () => {
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



const mainMenu = () => {
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
        console.log(`
        **********************************
        Employee and Department Maagement
        *********************************

        Connected to database with ${numEmployees} employeess.
        `);

        // enter inqurier mode proper
        mainMenu();
    })

    // conn.end();

    // .then(() => {
    // });

