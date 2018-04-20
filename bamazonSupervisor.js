function bamazonSupervisor() {
    require("dotenv").config();
    var mysql = require("mysql");
    var inquirer = require("inquirer");
    var t = require("console.table");
    var menu = require("./index.js");

    var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,

        // Your username
        user: "root",

        // Your password
        password: process.env.MYSQLPASSWORD,
        database: "bamazon"
    });

    function viewSales() {
        console.log("\033c");
        mainMenu();

    } //function viewSales

    function addDepartment() {
        console.log("\033c");
        inquirer.prompt([{
                name: "dept",
                message: "Please enter the new department's name"
            },
            {
                name: "overhead",
                message: "Please enter a valid cost with no dollar sign",
                validate: function (value) {
                    var match = value.match(/^[+-]?[1-9][0-9]{0,2}(?:(,[0-9]{3})*|([0-9]{3})*)(?:\.[0-9]{2})?$/);
                    if (match) {
                        return true;
                    }
                    return 'Please enter a valid cost with no dollar sign';
                }
            }
        ]).then(function (input) {
            // query database to see if user input for department already exists 
            connection.query(
                "SELECT * FROM departments WHERE department_name=?", input.dept,
                function (err, res) {
                    // if department name exists, send user back to supervisor menu
                    if (res.length) {
                        console.log("\n" + input.dept + " Exist. Please create a new one.");
                        mainMenu();
                        return
                    } else {
                        //  add department
                        console.log("\nAdding a new department...");

                        var query = connection.query(
                            "INSERT INTO departments SET ?", {
                                department_name: input.dept,
                                over_head_costs: input.overhead
                            },
                            function (err, res) {
                                console.log("\n" + input.dept + " Department added\n");
                                mainMenu();

                            }
                        ); //query INSERT
                    } //else
                } //function
            ); //query SELECT
        }); //.then
    } //function addDepartment

    function mainMenu() {
        inquirer.prompt([{
            name: "action",
            type: "list",
            message: "Choose Action?",
            choices: [
                "View Product Sales by Department",
                "Create New Department",
                "Back to Main Menu",
                "Exit Menu"
            ]
        }]).then(function (answer) {
            switch (answer.action) {
                case "View Product Sales by Department":
                    viewSales();
                    break;
                case "Create New Department":
                    addDepartment();
                    break;
                case "Back to Main Menu":
                    connection.end();
                    menu.bamazonMenu();
                    break;
                case "Exit Menu":
                    console.log("\033c");
                    console.log("\ngood bye")
                    connection.end();
                    break;
                default:
                    console.log("\033c");
                    console.log("\nEnter valid input\n")
                    mainMenu();
            } //switch
        }); //.then
    } //function mainMenu


    //////////////start here///////////////
    connection.connect(function (err) {
        if (err) throw err;
        console.log("\033c");
        mainMenu();
    });

} //function bamazonSupervisor



module.exports.bamazonSupervisor = bamazonSupervisor;