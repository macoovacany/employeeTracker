const inq = require('inquirer');
const process = require('process');

require('dotenv').config();

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
                console.clear(); console.log(returnStr);
                departmentMenu();
            }
        } else {
            console.log('No update to departments.')
            departmentMenu();
        }
    } catch (err) {
        switch (err.errno) {
            case 1062:
                console.clear(); console.log('Department already exists.');
                departmentMenu();
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

        console.clear(); console.table(rows);
        departmentMenu();
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
            console.clear(); console.log(returnStr);
            departmentMenu();
        }
    } catch (err) {
        switch (err.errno) {
            case 1451:
                returnStr = `Cannot remove department '${removeDepartment}'. \n Remove associated roles first.`
                console.clear(); console.log(returnStr);
                departmentMenu();
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
    console.clear();

    let addRoleDepartment = ''; // referenced in catch block

    try {
        const [dep_results, fields_1] = await conn.execute(
            'SELECT DEPARTMENT_NAME FROM DEPARTMENTS;');

        const departmentList = dep_results.map(element => {
            return element.DEPARTMENT_NAME;
        });

        // query for input parameters
        const ans = await inq.prompt([
            {
                type: 'input',
                name: 'addRoleTitle',
                message: 'Add name of new role'
            },
            {
                type: 'list',
                name: 'addRoleDepartment',
                message: 'Which department is the new role for?',
                choices: departmentList
            },
            {
                type: 'number',
                name: 'addRoleSalary',
                message: 'What is the salary of the new role?',
                // validate: (addRoleSalary) => {
                //     return (addRoleSalary.trim().match(/^[0-9]+$/) != null);
                // }
            }
        ]);


        // TODO, make sure values in row are unique
        const [rows, fields] = await conn.execute(
            `INSERT INTO ROLES (TITLE, SALARY, DEPARTMENT_ID) VALUES
            ('${ans.addRoleTitle}',
             ${ans.addRoleSalary},
              (select id from departments where department_name='${ans.addRoleDepartment}'));`);

        if (rows.affectedRows === 1) {
            returnStr = `Add role ${ans.addRoleTitle} to the ${ans.addRoleDepartment}.\n`;
            console.clear();
            console.log(returnStr);
            rolesMenu();
        } else {
            console.log(rows, fields);
            rolesMenu();
        }

    } catch (err) {
        switch (err.errno) {
            case 1064:
                console.log('Syntax Error in the SQL query. ');
                Quit();
            default:
                console.log(err);
                Quit();
        }
    }
};


const viewRoles = async () => {

    try {
        queryString = `select  roles.title, departments.department_name,  
(SELECT COUNT(*) FROM employees WHERE roles.ID = employees.ROLES_ID ) as EmployeeCount, roles.salary
from roles
inner join departments  
on departments.id = roles.department_id;`;

        const [rows, fields] = await conn.execute(
            queryString);
        console.clear(); console.table(rows);
        rolesMenu();

    } catch (err) {
        switch (err.errno) {
            default:
                console.log(err.errno);
                Quit();
        }
    }
};

const removeRoles = async () => {
    console.clear()
    let removeRole = ''; // referenced in catch block

    try {
        const [results, fields_1] = await conn.execute(
            'SELECT * FROM ROLES;');

        roleList = results.map(element => {
            return element.TITLE;
        });

        const ans = await inq.prompt([
            {
                type: 'list',
                name: 'removeRoleSelection',
                message: 'Which department do you want to remove?',
                choices: roleList
            }]);

        removeRole = ans.removeRoleSelection;

        const [rows, fields_2] = await conn.execute(
            'DELETE FROM ROLES WHERE TITLE = ?;',
            [removeRole]);

        if (rows.affectedRows === 1) {
            returnStr = `Removed ${removeRole}.\n`;
            console.clear(); console.log(returnStr);
            rolesMenu();
        }
    } catch (err) {
        switch (err.errno) {
            case 1451:
                returnStr = `Cannot remove role '${removeRole}'. \n Remove associated employees first.`
                console.clear(); console.log(returnStr);
                rolesMenu();
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

const addEmployee = async () => {
    console.clear();

    try {

        // roles
        const [roles_results, fields_1] = await conn.execute(
            'SELECT * FROM ROLES;');
        const rolesList = roles_results.map(element => {
            return element.TITLE;
        });

        // for managers
        // assumme anyoen can be a manager
        const [managers, fields_2] = await conn.execute(
            'SELECT * FROM EMPLOYEES;');
        managerList = managers.map(element => {
            return { name: `${element.FIRST_NAME} ${element.LAST_NAME}`, value: element.ID };
        });


        // query for input parameters
        const ans = await inq.prompt([
            {
                type: 'input',
                name: 'addEmployeeFirstname',
                message: 'Employees First Name?'
            },
            {
                type: 'input',
                name: 'addEmployeeLastname',
                message: 'Last Name?'
            },
            {
                type: 'list',
                name: 'addEmployeeRole',
                message: 'What is the employees role?',
                choices: rolesList
            },
            {
                type: 'list',
                name: 'addEmployeeManager',
                message: 'Who is the employees manager?',
                choices: [...managerList, { name: 'No manager', value: null }]
            },
        ]);

        // TODO validation checks
        // TODO, make sure values in row are unique
        // TODO: check if the employee is in the same department as the manager 
        // if (managerID >0){
        // make sure the manager and employee are in the same department
        // }

        const [rows, fields_3] = await conn.execute(
            `INSERT INTO EMPLOYEES (FIRST_NAME, LAST_NAME, ROLES_ID, MANAGER_ID) VALUES
            ('${ans.addEmployeeFirstname}', 
            '${ans.addEmployeelastname}', 
            ${ans.addEmployeeRole}, 
            ${ans.addEmployeeManager});`);

        if (rows.affectedRows === 1) {
            returnStr = `Added employee ${ans.addEmployeeFirstname} ${ans.addEmployeelastname}`;
            console.clear();
            console.log(returnStr);
            rolesMenu();
        } else {
            console.log(rows, fields);
            rolesMenu();
        }

    } catch (err) {
        switch (err.errno) {
            case 1064:
                console.log('Syntax Error in the SQL query. ');
                Quit();
            default:
                console.log(err);
                Quit();
        }
    }
};

const viewEmployees = async () => {

    try {
        queryString = `select  
        concat(emp.first_name, ' ', emp.last_name) as employee_name, 
        roles.title , 
      concat(Man.first_name, ' ', Man.last_name) as manager_name
     
      from employees as Emp
      
      inner join roles
     on Emp.roles_id = roles.id
      
     left join employees as Man
     on Emp.manager_id = Man.id
     
     order by emp.last_name;
      
     `;

        const [rows, fields] = await conn.execute(
            queryString);

        console.clear();
        console.log('Default sort order by last name');
        console.table(rows);
        employeesMenu();

    } catch (err) {
        switch (err.errno) {
            default:
                console.log(err.errno);
                Quit();
        }
    }
};

const modifyEmployee = async () => {
    console.clear();

    let TODO;

    try {
        // query for input parameters
        const ans = await inq.prompt([
            {
                type: 'input',
                name: 'TODO',
                message: 'TODO: Fix this menu item.'
            }
        ]);


        TODO = ans.TODO;  // prepar eanswer for SQL
        if (TODO) {

            queryString = `SELECT 'TODO: Fix SQL query';`
            const [rows, fields] = await conn.execute(
                queryString,
                [TODO]);
            if (rows.affectedRows === 1) {
                returnStr = `TODO:  ${TODO}.\n`;
                console.clear(); console.log(returnStr);
                TODOMenu();
            }
        } else {
            TODOMenu(() => 'TODO: Failure description');
        }
    } catch (err) {
        switch (err.errno) {
            default:
                console.log(err.errno);
                Quit();
        }
    }
};

const removeEmployee = async () => {
    console.clear()
    let removeEmployee = ''; // referenced in catch block
    let employeeName = '';

    try {
        const [results, fields_1] = await conn.execute(
            'SELECT * FROM EMPLOYEES;');

        employeeList = results.map(element => {
            return { name: `${element.FIRST_NAME} ${element.LAST_NAME}`, value: element.ID };
        });

        const ans = await inq.prompt([
            {
                type: 'list',
                name: 'removeEmployeeSelection',
                message: 'Which employee do you want to remove?',
                choices: employeeList
            }]);

        removeEmployee = ans.removeEmployeeSelection;
        employeeName = employeeList.filter((e) => {
            if (e.value === removeEmployee) {
                return e.name;
            }
        })[0].name;

        const [rows, fields_2] = await conn.execute(
            'DELETE FROM EMPLOYEES WHERE ID = ?;',
            [removeEmployee]);

        if (rows.affectedRows === 1) {
            returnStr = `Removed ${employeeName}.\n`;
            console.clear(); console.log(returnStr);
            employeesMenu();
        }
    } catch (err) {
        switch (err.errno) {
            case 1451:
                returnStr = `Cannot remove employee '${employeeName}'.`
                console.clear(); console.log(returnStr);
                employeesMenu();
                break;
            default:
                console.log(err.errno);
                Quit();
        }
    }

};


// *************************
// Generic reports
// *************************


const viewOrgChart = async () => {

    try {
        queryString = `select 
        dep.department_name, 
        sum(roles.salary) as department_budget
      
      from roles
        inner join employees as emp
        on emp.roles_id = roles.id
        
        inner join departments as dep
        on roles.department_id = dep.id
      
      group by dep.department_name;
      `;

        const [rows, fields] = await conn.execute(
            queryString);

        console.clear();
        console.log('Default sort order by last name');
        console.table(rows);
        employeesMenu();

    } catch (err) {
        switch (err.errno) {
            default:
                console.log(err.errno);
                Quit();
        }
    }
};

const viewBudget = async () => {

    try {
        queryString = `select 
        dep.department_name, 
        sum(roles.salary) as department_budget
      
      from roles
        inner join employees as emp
        on emp.roles_id = roles.id
        
        inner join departments as dep
        on roles.department_id = dep.id
      
      group by dep.department_name;
      `;

        const [rows, fields] = await conn.execute(
            queryString);

        console.clear();
        console.log('Default sort order by last name');
        console.table(rows);
        employeesMenu();

    } catch (err) {
        switch (err.errno) {
            default:
                console.log(err.errno);
                Quit();
        }
    }
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

const rolesMenu = () => {

    console.log('********************************************************')

    inq.prompt(
        [{
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to do?',
            choices: [
                { name: 'add role', value: addRole },
                { name: 'view roles', value: viewRoles },
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
                { name: 'View Org Chart', value: viewOrgChart },
                { name: 'Show department budgets', value: viewBudget },
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
                    // { name: 'Debug Query', value: debugQuery },
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
                port: 3306,
                database: process.env.DB_NAME,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
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