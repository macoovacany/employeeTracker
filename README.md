#  Employee Tracker

 * []()

This homework assignment is to architect and build a solution for managing a company's employees using node, inquirer, and MySQL.

<span style="color:red"> __WARNING__ </span>: the code is NOT protected against SQL injection. Refer the video.

## Requirements
The business rules of the database are based on employees, having roles, belonging to departments and having managers.

 The following rules are specified:

 1) Each __employee__:
     1) must have a First Name 
     1) must have a Last Name
     1) may have a Manager
     1) must have a __role__.
 1) A new employee can be added.
 1) An employee can have at most one manager.
 1) An employee does not necessarily have a manager (implies nullable).
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
 * [Employees...](#EmployeeMenu)
 * [Roles...](#RolesMenu)
 * [Departments...](#DepartmentsMenu)
 * [Reports...](#ReportsMenu)

or to quit the application.


### Employee Menu
<div id="EmployeeMenu"></div>

The employee menu allows the user to add, view, delete or modify the the employee data. 

When __adding a employee__,
* _First name_: The first name must be specified, but can be any arbitrary string. <span style="color:red"> __WARNING__ </span>: the code is NOT protected against SQL injection. Apologies to O'Reillys out there.
* _Last name_: The last name is not required and can be blank.
* _Employee Role_: Selection from existing roles
* _Manager_: Optional. Skipping this step will imply the employee does not have a manager.

The __view employees__ will show a table of:
 
 * employee name,
 * their role, and
 * their manager
 
 By default, the employees are sorted by first name. This can not be controlled by the user.

__Change employee's manager__ will change the 

__Change employee's role__

__Remove employees__


### Roles Menu
<div id="RolesMenu"></div>


### Departments Menu
<div id="DepartmentMenu"></div>


### Reports
<div id="ReportsMenu"></div>

 1) Show the employees under a specific manager.
 1) Show the employees in a specific department.
 1) Show the total budget for each department.






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
  
Build a command-line application that at a minimum allows the user to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles

Bonus points if you're able to:

  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget of a department -- ie the combined salaries of all employees in that department

We can frame this challenge as follows:

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

How do you deliver this? Here are some guidelines:

* Use the [MySQL](https://www.npmjs.com/package/mysql) NPM package to connect to your MySQL database and perform queries.

* Use [InquirerJs](https://www.npmjs.com/package/inquirer/v/0.2.3) NPM package to interact with the user via the command-line.

* Use [console.table](https://www.npmjs.com/package/console.table) to print MySQL rows to the console. There is a built-in version of `console.table`, but the NPM package formats the data a little better for our purposes.

* You may wish to have a separate file containing functions for performing specific SQL queries you'll need to use. Could a constructor function or a class be helpful for organizing these?

* You will need to perform a variety of SQL JOINS to complete this assignment, and it's recommended you review the week's activities if you need a refresher on this.

![Employee Tracker](Assets/employee-tracker.gif)

### Hints

* You may wish to include a `seed.sql` file to pre-populate your database. This will make development of individual features much easier.

* Focus on getting the basic functionality completed before working on more advanced features.

* Review the week's activities for a refresher on MySQL.

* Check out [SQL Bolt](https://sqlbolt.com/) for some extra MySQL help.

## Minimum Requirements

* Functional application.

* GitHub repository with a unique name and a README describing the project.

* The command-line application should allow users to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles

## Bonus

* The command-line application should allow users to:

  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget of a department -- ie the combined salaries of all employees in that department

## Commit Early and Often

One of the most important skills to master as a web developer is version control. Building the habit of committing via Git is important for two reasons:

* Your commit history is a signal to employers that you are actively working on projects and learning new skills.

* Your commit history allows you to revert your codebase in the event that you need to return to a previous state.

Follow these guidelines for committing:

* Make single-purpose commits for related changes to ensure a clean, manageable history. If you are fixing two issues, make two commits.

* Write descriptive, meaningful commit messages so that you and anyone else looking at your repository can easily understand its history.

* Don't commit half-done work, for the sake of your collaborators (and your future self!).

* Test your application before you commit to ensure functionality at every step in the development process.

We would like you to have well over 200 commits by graduation, so commit early and often!

**Important**: You will be committing a file that contains your database credentials. Make sure your MySQL password is not used for any other personal accounts, because it will be visible on GitHub. In upcoming lessons, you will learn how to better secure this password, or you can start researching npm packages now that could help you.


## Submission on BCS

You are required to submit the following:

* The URL of the GitHub repository

* A video demonstrating the entirety of the app's functionality 

- - -
© 2021 Trilogy Education Services, LLC, a 2U, Inc. brand. Confidential and Proprietary. All Rights Reserved.
