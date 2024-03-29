// https://github.com/sidorares/node-mysql2#using-promise-wrapper
const mysql = require('mysql2/promise');
// const {escape} = require('mysql2');
// conn is going to be kept open throughout the interface with the menus
var conn;   // global connection 

const inq = require('inquirer');
const process = require('process');
require('dotenv').config();
// const { AsciiTree } = require('../lib');

// create, read, update and delete queries are called
// add,    view, modify and remove

// **************************
// Department queries
// **************************

const addDepartment = async () => {

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
                addMenu(() => {
                    console.clear();
                    console.log('--------------------------------------');
                    console.log(returnStr);
                    console.log('--------------------------------------');
                });
            }
        } else {
            addMenu(() => {
                console.log('No update to departments.')
            });
        }
    } catch (err) {
        switch (err.errno) {
            case 1062:
                addMenu(() => {
                    console.log('Department already exists.');
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

        viewMenu(() => {
            console.clear();
            console.table(rows);
        }


        );
    } catch (err) {
        throw err;
    }
}


// meaningless action for departments 
// const modifyDepartments = () => {}


const removeDepartments = async () => {

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
                choices:
                    [...departmentList,
                    new inq.Separator(),
                        'Abort Deletion',
                    new inq.Separator(),
                    ]
            }]);

        removeDepartment = ans.removeDepartmentSelection;

        if ('Abort Deletion' === removeDepartment) {
            removeMenu(() => {
                console.clear();
                console.log('--------------------------------------');
                console.log('Aborted Department Deletion');
                console.log('--------------------------------------');
            })
        } else {
            const [rows, fields_2] = await conn.execute(
                'DELETE FROM DEPARTMENTS WHERE DEPARTMENT_NAME = ?;',
                [removeDepartment]);

            if (rows.affectedRows === 1) {
                returnStr = `Removed ${removeDepartment}.\n`;
                removeMenu(() => {
                    console.clear();
                    console.log('--------------------------------------');
                    console.log(returnStr);
                    console.log('--------------------------------------');
                });
            }
        }
    } catch (err) {
        switch (err.errno) {
            case 1451:
                returnStr = `Cannot remove department '${removeDepartment}'. \n Remove associated roles first.`
                removeMenu(() => {
                    console.log('--------------------------------------')
                    console.log(returnStr);
                    console.log('--------------------------------------')
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


    let addRoleDepartment = ''; // referenced in catch block

    try {

        // deparment list
        const [dep_results, fields_1] = await conn.execute(
            'SELECT * FROM DEPARTMENTS;');
        const departmentList = dep_results.map(element => {
            return { name: `${element.DEPARTMENT_NAME}`, value: element.ID };
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
                name: 'addRoleDepartmentID',
                message: 'Which department is the new role for?',
                choices: departmentList
            },
            {
                type: 'number',
                name: 'addRoleSalary',
                message: 'What is the salary of the new role?',
                default: 45000,
            }
        ]);


        // TODO, make sure values in row are unique
        const [rows, fields] = await conn.execute(
            'INSERT INTO ROLES (TITLE, SALARY, DEPARTMENT_ID) VALUES (? , ? , ?);',
            [
                ans.addRoleTitle,
                ans.addRoleSalary,
                ans.addRoleDepartmentID
            ]);
        if (rows.affectedRows === 1) {
            returnStr = `Add role ${ans.addRoleTitle} to the ${ans.addRoleDepartment}.\n`;
            addMenu(() => {
                console.clear();
                console.log(returnStr);
            });
        } else {
            addMenu(() => {
                console.clear();
                console.log(rows, fields);
            }

            );
        }

    } catch (err) {
        switch (err.errno) {
            case 1064:
                console.log('Syntax Error in the SQL query. ');
                console.log(err);
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


        viewMenu(() => {
            console.clear();
            console.table(rows);
        });

    } catch (err) {
        switch (err.errno) {
            default:
                console.log(err.errno);
                Quit();
        }
    }
};

const removeRoles = async () => {

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
            removeMenu(() => {
                console.clear()
                console.log(returnStr);
            });
        }
    } catch (err) {
        switch (err.errno) {
            case 1451:
                returnStr = `Cannot remove role '${removeRole}'. \n Remove associated employees first.`
                removeMenu(() => {
                    console.clear()
                    console.log(returnStr);
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



const addEmployee = async () => {

    try {

        // roles
        const [roles_results, fields_1] = await conn.execute(
            'SELECT * FROM ROLES;');
        const rolesList = roles_results.map(element => {
            return { name: `${element.TITLE}`, value: element.ID };
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
                message: 'Employees First Name?',
                validate: (input) => {
                    if (input === '') {
                        return 'A name must be entered.';
                    } else {
                        return true;
                    }
                }
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
                choices: [
                    { name: 'No manager', value: null },
                    new inq.Separator(),
                    ...managerList,
                    new inq.Separator(),
                ]
            },
        ]);

        // TODO validation checks
        // TODO, make sure values in row are unique
        // TODO: check if the employee is in the same department as the manager 
        // if (managerID >0){
        // make sure the manager and employee are in the same department
        // }

        const [rows, fields_3] = await conn.execute(
            'INSERT INTO EMPLOYEES (FIRST_NAME, LAST_NAME, ROLES_ID, MANAGER_ID) VALUES ( ? , ? , ?, ? );',
            [
                ans.addEmployeeFirstname,
                ans.addEmployeeLastname,
                ans.addEmployeeRole,
                ans.addEmployeeManager
            ]);

        if (rows.affectedRows === 1) {
            returnStr = `Added employee ${ans.addEmployeeFirstname} ${ans.addEmployeelastname}`;
            addMenu(() => {
                console.clear();
                console.log(returnStr);
            });
        } else {
            addMenu(() => {
                console.clear();
                console.log(rows, fields);
            });

        }

    } catch (err) {
        console.log(err)
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
     
     order by emp.last_name; `;

        const [rows, fields] = await conn.execute(
            queryString);

        viewMenu(() => {
            console.clear();
            console.table(rows);
            console.log('Default sort order by last name');
        });

    } catch (err) {
        switch (err.errno) {
            default:
                console.log(err.errno);
                Quit();
        }
    }
};




const viewEmployeesByManager = async () => {

    try {
        // const managementTree = new AsciiTree('Managers');
        managersList = (await getManagers()).rows;

        let orgTree = 'Managers\n';

        const buildOrgTree = async () => {
            managersList.forEach(async (mngr) => {




                orgTree += '+---+ ' + mngr.manager_name + '\n';



                const [empRows, empfields] = await conn.execute(
                    `SELECT concat(employees.first_name, ' ' , employees.last_name) as employee_name
            FROM employee_tracker_db.employees
                       where MANAGER_ID = ?;`
                    , [mngr.manager_id]);

                empRows.forEach((emp) => {
                    console.log(empRows.employee_name);
                    orgTree += '   +--- ' + empRows.employee_name + '\n';
                });
            });
            return orgTree;
        }

        let strOrgTree = await buildOrgTree();

        viewMenu(() => {
            console.log(strOrgTree);
        });

    } catch (err) {
        switch (err.errno) {
            default:
                console.log(err.errno);
                Quit();
        }
    }
};



const getManagers = async () => {
    try {
        const queryString = `select  distinct  
      Manager.ID as manager_id,
      concat(Manager.first_name, ' ', Manager.last_name) as manager_name
     
      from employees as Emp
      
      inner join roles
     on Emp.roles_id = roles.id
      
     left join employees as Manager
     on Emp.manager_id = Manager.id
     where Emp.manager_id is not null
     
     order by emp.last_name;`


        const [rows, fields] = await conn.execute(
            queryString);

        return { rows, fields };

    } catch (err) {
        switch (err.errno) {
            default:
                console.log(err.errno);
                Quit();
        }
    }
}


const viewManagers = async () => {
    try {

        const managersQuery = await getManagers()

        viewMenu(() => {
            console.clear();
            console.table(managersQuery.rows);
            console.log('-----------------------------------------')
            console.log('Default sort order by last name');
        });

    } catch (err) {
        switch (err.errno) {
            default:
                console.log(err.errno);
                Quit();
        }
    }
};


const changeEmployeeManager = async () => {

    try {
        const [empRows, empFields] = await conn.execute(
            'SELECT * FROM Employees;');

        const employeeList = empRows.map((emp) => {
            return {
                name: emp.FIRST_NAME + ' ' + emp.LAST_NAME,
                value: emp.ID
            };
        })
        const ans = await inq.prompt([
            {
                type: 'list',
                name: 'changeEmployee',
                message: 'Change which employees manager?',
                choices: [
                    ...employeeList,
                    new inq.Separator(),
                    { name: 'Abort Change', value: -1 },
                    new inq.Separator(),
                ]
            },
            {
                type: 'list',
                name: 'changeManager',
                message: 'The new manager is...?',
                choices: [
                    ...employeeList,
                    new inq.Separator(),
                    { name: 'Abort Change', value: -1 },
                    new inq.Separator(),
                ]
            }

        ])

        // if not aborted
        if (ans.changeEmployee > 0 && ans.changeManager > 0) {

            const [rows, fields_3] = await conn.execute(
                'update employees set manager_id = ? where id = ?;',
                [
                    ans.changeManager,
                    ans.changeEmployee,
                ]);

            if (rows.affectedRows === 1) {
                returnStr = `Updated employee `;
                changeMenu(() => {
                    console.clear();
                    console.log(returnStr);
                    console.clear('---------------------------------------------------------------');
                });

            } else {
                changeMenu(() => {
                    console.clear();
                    console.log(rows, fields);
                });
            }
        } else {
            changeMenu(() => {
                console.clear();
                console.log('Change to employee aborted.');
                console.clear('---------------------------------------------------------------');
            })
        }

    } catch (err) {
        console.log(err)
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


const changeEmployeeByRole = async () => {

}


const removeEmployee = async () => {

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
            removeMenu(() => {
                console.clear()
                console.log(returnStr);
            });
        }
    } catch (err) {
        switch (err.errno) {
            case 1451:
                returnStr = `Cannot remove employee '${employeeName}.
Check if this employee is a manager.`
                removeMenu(() => {
                    console.clear()
                    console.log('--------------------------------------')
                    console.log(returnStr);
                    console.log('--------------------------------------\n')
                });
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

        employeesMenu(() => {
            console.log('Default sort order by last name');
            console.table(rows);
        });

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

        viewMenu(() => {
            console.clear()
            console.table(rows);
        });

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
const viewMenu = (printFunCallback = () => { }) => {
    printFunCallback();

    inq.prompt(
        [{
            type: 'list',
            name: 'menuChoice',
            message: 'View.. ',
            choices: [
                { name: ' departments', value: viewDepartments },
                { name: ' roles', value: viewRoles },
                { name: ' managers', value: viewManagers },
                { name: ' employees', value: viewEmployees },
                new inq.Separator(),
                // { name: '  employees by role', value: viewEmployeesByRole },
                // { name: '  employees by manager', value: viewEmployeesByManager },
                // new inq.Separator(),
                // { name: '  the Org Chart', value: viewOrgChart },
                { name: '  the department budgets', value: viewBudget },
                new inq.Separator(),
                { name: 'Back to Main Menu', value: mainMenu },
            ]
        },
        ]
    )
        .then((ans) => {
            ans.menuChoice();
        });
}


const addMenu = async (printFunCallback = () => { }) => {
    printFunCallback();

    const ans = await inq.prompt(
        [{
            type: 'list',
            name: 'menuChoice',
            message: 'Add...',
            choices: [
                { name: ' a new employee', value: addEmployee },
                { name: ' a new role', value: addRole },
                { name: ' a new department', value: addDepartment },
                new inq.Separator(),
                { name: 'Back to Main Menu', value: mainMenu },
            ]
        },
        ]
    );

    ans.menuChoice();
}

const changeMenu = (printFunCallback = () => { }) => {

    printFunCallback();

    inq.prompt(
        [{
            type: 'list',
            name: 'menuChoice',
            message: 'Change ...',
            choices: [
                { name: ' an employee\'s manager ', value: changeEmployeeManager },
                { name: ' an employee\'s role', value: changeEmployeeByRole },
                // { name: ' employees by manager', value: modifyManager },
                // { name: 'modify a department', value: modifyDepartments },
                new inq.Separator(),
                { name: 'Back to Main Menu', value: mainMenu },
            ]
        },
        ])
        .then((ans) => {
            ans.menuChoice();
        });
}

const removeMenu = (printFunCallback = () => { }) => {
    console.clear();
    printFunCallback();

    inq.prompt(
        [{
            type: 'list',
            name: 'menuChoice',
            message: 'Remove ...',
            choices: [
                { name: ' a department', value: removeDepartments },
                { name: ' a role', value: removeRoles },
                { name: ' an employee', value: removeEmployee },
                new inq.Separator(),
                { name: 'Back to Main Menu', value: mainMenu },
            ]
        },
        ]
    )
        .then((ans) => {
            ans.menuChoice();
        });
}



const mainMenu = (printFunCallback = () => { }) => {

    console.clear();
    printFunCallback();

    inq.prompt(
        [
            {
                type: 'list',
                name: 'menuChoice',
                message: 'What would you like to do?',
                choices: [
                    { name: 'View... ', value: viewMenu },
                    { name: 'Add...', value: addMenu },
                    { name: 'Change...', value: changeMenu },
                    { name: 'Remove...', value: removeMenu },
                    new inq.Separator(),
                    // { name: 'Debug Query', value: debugQuery },
                    { name: 'Quit.', value: Quit },
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

        mainMenu(() => {
            console.log(`
        **********************************
        Employee and Department Maagement
        *********************************

        Connected to database with ${numEmployees} employees.  \n\n`)
        });

    } catch (err) {
        console.log(err)
    }
}

main()