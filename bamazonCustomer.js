function bamazonCustomer() {

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


    function allProduct() {
        console.log("\033c");
        connection.query("SELECT * FROM products", function (err, res) {
            console.table(res);
            buyItem();
        });
    }
    // function buyItem called from function allProduct
    function buyItem() {
        inquirer.prompt([{
                name: "buyId",
                message: "Enter the Id of the Item you would like to purchase ",
                validate: answer => {
                    if (answer.match(/^[1-9]\d*$/)) {
                        return true;
                    } else {
                        return "Please enter a positive integer.";
                    }
                }
            },
            {
                name: "amount",
                type: "input",
                message: "How many? ",
                validate: answer => {
                    if (answer.match(/^[1-9]\d*$/)) {
                        return true;
                    } else {
                        return "Please enter a positive integer.";
                    }
                }
            }
        ]).then(function (userIn) {
            var query = connection.query("SELECT * FROM products WHERE item_id=?", userIn.buyId, function (err, res) {
                if (res[0] == undefined) {
                    console.log("\n" + userIn.buyId + "  Item id not found\n");
                } else {
                    if (userIn.amount > res[0].stock_quantity) {
                        console.log("\nInsufficient quantity! Only " + res[0].stock_quantity + " available.\n");
                    } else {
                        var salesTot = userIn.amount * res[0].price.toFixed(2);
                        var query = connection.query("UPDATE products SET ? WHERE ?", [{
                                stock_quantity: res[0].stock_quantity - userIn.amount,
                                product_sales: (res[0].product_sales) + parseFloat(salesTot)
                            },
                            {
                                item_id: userIn.buyId
                            }

                        ]);
                        console.log("\nThe total cost is $" + salesTot +
                            "\n" + res[0].product_name + " past quantity " + res[0].stock_quantity +
                            ", now has a quantity of " + (res[0].stock_quantity - userIn.amount));
                    }
                }
                mainMenu();
            }); //query
        }); //.then
    } //function buyItem

    function mainMenu() {
        inquirer.prompt([{
            name: "action",
            type: "list",
            message: "Choose Action?",
            choices: [
                "View and Purchase Products",
                "Back to Main Menu",
                "Exit Menu"
            ]
        }]).then(function (answer) {
            switch (answer.action) {
                case "View and Purchase Products":
                    allProduct();
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
}
module.exports.bamazonCustomer = bamazonCustomer;