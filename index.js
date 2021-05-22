const inq = require('inquirer');
const process = require('process');
const mysql = require('mysql2');

// connection is going to be kept open throughout the interface with 
const CONNECTION = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'EMPLOYEE_TRACKER_DB',
});


const AddDepartment = () => {

    console.log('AddDepartment');
    inq.prompt([
        {
            type: 'input',
            name: 'AddDepartment',
            message: 'You need to input a value for AddDepartment'
        }
    ])
        .then((ans) => {
            console.log(ans)
            mainMenu();
        });

};


const AddRole = () => {

    console.log('AddRole');
    inq.prompt([
        {
            type: 'input',
            name: 'AddRole',
            message: 'You need to input a value for AddRole'
        }
    ])
        .then((ans) => {
            console.log(ans)
            mainMenu();
        });

};


const AddEmployee = () => {

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
            mainMenu();
        });

};


const ViewDepartments = () => {

    console.log('ViewDepartments');
    inq.prompt([
        {
            type: 'input',
            name: 'ViewDepartments',
            message: 'You need to input a value for ViewDepartments'
        }
    ])
        .then((ans) => {
            console.log(ans)
            mainMenu();
        });

};


const ViewRoles = () => {

    console.log('ViewRoles');
    inq.prompt([
        {
            type: 'input',
            name: 'ViewRoles',
            message: 'You need to input a value for ViewRoles'
        }
    ])
        .then((ans) => {
            console.log(ans)
            mainMenu();
        });

};


const ViewEmployees = () => {

    console.log('ViewEmployees/n/n');
    CONNECTION.query(
        'SELECT * FROM EMPLOYEES;',
        (err, results, fields) => {
            if (err) throw err;
            console.table(results);
            mainMenu();
        });

};


const UpdateEmployee = () => {

    console.log('UpdateEmployee');
    inq.prompt([
        {
            type: 'input',
            name: 'UpdateEmployee',
            message: 'You need to input a value for UpdateEmployee'
        }
    ])
        .then((ans) => {
            console.log(ans)
            mainMenu();
        });

};


const ViewManagers = () => {

    console.log('ViewManagers');
    inq.prompt([
        {
            type: 'input',
            name: 'ViewManagers',
            message: 'You need to input a value for ViewManagers'
        }
    ])
        .then((ans) => {
            console.log(ans)
            mainMenu();
        });

};


const DeleteDepartments = () => {

    console.log('DeleteDepartments');
    inq.prompt([
        {
            type: 'input',
            name: 'DeleteDepartments',
            message: 'You need to input a value for DeleteDepartments'
        }
    ])
        .then((ans) => {
            console.log(ans)
            mainMenu();
        });

};


const DeleteRoles = () => {

    console.log('DeleteRoles');
    inq.prompt([
        {
            type: 'input',
            name: 'DeleteRoles',
            message: 'You need to input a value for DeleteRoles'
        }
    ])
        .then((ans) => {
            console.log(ans)
            mainMenu();
        });

};


const RemoveEmployees = () => {

    console.log('RemoveEmployees');
    inq.prompt([
        {
            type: 'input',
            name: 'RemoveEmployees',
            message: 'You need to input a value for RemoveEmployees'
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
    CONNECTION.end();
    process.exit();
}

mainMenuQuestions = [
    {
        type: 'list',
        name: 'menuChoice',
        message: 'What would you like to do?',
        choices: [
            { name: 'Add department', value: AddDepartment },
            { name: 'Add role', value: AddRole },
            { name: 'Add employee', value: AddEmployee },
            { name: 'View departments', value: ViewDepartments },
            { name: 'View roles', value: ViewRoles },
            { name: 'View employees', value: ViewEmployees },
            { name: 'Update employee', value: UpdateEmployee },
            { name: 'View managers', value: ViewManagers },
            { name: 'Delete departments', value: DeleteDepartments },
            { name: 'Delete Roles', value: DeleteRoles },
            { name: 'Remove employees', value: RemoveEmployees },
            { name: 'Show summaries', value: ShowSummaries },
            { name: 'Quit', value: Quit },
        ]
    },
];


const mainMenu = () => {
    inq.prompt(mainMenuQuestions)
        .then((ans) => {
            ans.menuChoice();
        });
}


// main entry point - straight into the 
// database checks
// then call the inquirer UI proper
CONNECTION.query(
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

    // connection.end();

    // .then(() => {
    // });

