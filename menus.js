const inq = require('inquirer');
const process  = require('process');



// Add departments
// Add roles
// Add  employees
// View departments
// View roles
// View employees
// Update employee roles
// Update employee managers
// View employees by manager
// Delete departments, 
// Delete roles, 
// Delete employees
// View the total utilized budget of a department -- ie the combined salaries of all employees in that department



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

    console.log('ViewEmployees');
    inq.prompt([
        {
            type: 'input',
            name: 'ViewEmployees',
            message: 'You need to input a value for ViewEmployees'
        }
    ])
        .then((ans) => {
            console.log(ans)
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
            { name: 'Quit', value: 'Quit' },
        ]
    },
];


const mainMenu = () => {
    inq.prompt(mainMenuQuestions)
        .then((ans) => {
            if (ans.menuChoice === 'Quit') {
                process.exit();
            }

            ans.menuChoice();

        });
}

console.log(`
**********************************
Employee and Department Maagement
*********************************

`);

mainMenu()
