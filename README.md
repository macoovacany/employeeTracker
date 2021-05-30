#  Employee Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is a homework assignment is to architect and build a solution for managing a company's employees using node, inquirer, and MySQL.

 * [A way of manually seeding the database](https://drive.google.com/file/d/1fkhYfa1cRZLKR0t-4KyE2HlUZYFjFEfT/view)
 * [An example of the Employee tracking database in action ](https://drive.google.com/file/d/1wBLq7sPn8lSGkrOsYVBC8rsRwKXJVjc3/view)


<span style="color:red"> __WARNING__ </span>: the code is __not guaranteed  protected against SQL injection__.  Some protections have been added. 

## Application 
This assignment is to architect and build a solution for managing a company's employees using node, inquirer, and MySQL. The business rules of the database are based on employees having roles, belonging to departments and having managers. Roles are are separated into departments. The following rules are specified:

 1) Each __employee__:
     1) _must_ have a First Name 
     1) _may_ have a Last Name
     1) _may_ have a Manager
     1) _must_ have a __role__.
 1) A new employee can be added.
 1) An employee can have zero or one managers.
 1) An employee can both be a manager and have a manager (nested management).
 1) <span style="color:red">Management structure cannot be circular (not implemented). </span>
 1) You can not remove a employee if they are a manager for another employee.
 1) A manager must belong in the same department as the employee.
 1) An employee can change managers.
 1) An employee can change roles.
 1) The role determines the salary of the employee.
 1) A role cannot be removed if there is an employee in that role.
 1) Each role belongs to exactly one __department__.
 1) A department can not be removed if there are employee associated with the department.

 The following reporting requirements are specified:

 1) Show the employees under a specific manager.
 1) Show the employees in a specific department.
 1) Show the total budget for each department.

## Interface
### Main Menu
The main menu directs the database user to the various sub menus:
 * [View...](#viewMenu)
 * [Add...](#addMenu)
 * [Change...](#changeMenu)
 * [Remove...](#removeMenu)

or to quit the application.


### View Menu
<div id="EmployeeMenu"></div>

The employee menu allows the user to add, view, delete or modify the the employee data. 


The __view employees__ will show a table of:
 
 * employee name,
 * their role, and
 * their manager
 
 By default, the employees are sorted by first name. This can not be controlled by the user.

__viewing a department__  //TODO

__viewing a role__  //TODO

__show org structure__  //TODO: get ascii tree view working properly

### Add Menu
<div id="addMenu"></div>

When __adding a employee__,
* _First name_: The first name must be specified, but can be any arbitrary string. 
* _Last name_: The last name is not required and can be blank.
* _Employee Role_: Selection from existing roles
* _Manager_: Optional. Skipping this step will imply the employee does not have a manager.

__adding a department__  //TODO

__adding a role__  //TODO

### Change Menu
<div id="changeMenu"></div>

__Change employee's manager__  note any current employee can become a new manager.

### Remove Menu
<div id="renoveMenu"></div>

__Remove employee__ will remove an employee. Note that the employees who are managers of other employees will not removed.  To do so, use the _modify manager_ command in the _Change Business Structure_  menu.


__Remove role__ will provide an interface...

__Remove Department__ will provide an interface...

## Database Schema

Design the following database schema containing three tables:

![Database Schema](Assets/schema.png)

* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager
  
## Installation

The steps to install the employeeTracker application are:
1) Ensure NodeJS is installed.
1) Ensure MySQL server is available on localhost:3306.
1) Clone or download the GitHub repo.
1) rename the _.env.EXAMPLE_ file to _.env_ and update the file to suit your application.
1) Manually seed the database using the files (in this order):
      1) _application_root_directory_/seed/schema.js
      1) _application_root_directory_/seed/seed.js
1) npm install
1) npm start
 
This NodeJS application uses the following npm packages:
 * dotenv
 * inquirer
 * mysql2
## TODO:
1) __ascii tree view of the org structure__
1) Double check SQL injection protection.
1) <span id="seedTroubles"> node script to seed the database automatically</span>. Problems encountered are: 
    1) Cannot run '_mysql < ./seed/schema.js_' on windows. (mysql.exe is not on the path)
    1) We __can__ run _"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" --version_ on windows, through the command prompt (note the double quotes). 
    1) shelljs escapes the string for the folder structure incompatible with calling MySQL through the command prompt. Many, many variations of back ticks, escape slashes and literal strings were tried. 
    1) Can not run the SQL command _SOURCE ./seed/schema.js_ inside a query from NodeJS.
    1) The npm package _execsql_ is sus.
1) Cross link the various modify view options so you are not menu hopping all the time.
1) Change employees under a particular manager
1) Enforce business rules
    1) no circular arrangements of management
    1) no removing departments that have roles assigned
    1) no removing roles that have employees

## GitHub Project 

This project is licensed under a MIT license. 

This project is a homework assignment and should not be used for production.

No contributions are expected. Any pull requests will probably be ignored. 

Created by macoovacany, contact me directly macoovacany@hotmail.com with any questions.
