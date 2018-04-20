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

    } //function viewSales

    function addDepartment() {

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