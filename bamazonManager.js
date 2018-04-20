function bamazonManager() {

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
            console.log("\n");
            mainMenu();
        }); //query
    } //end allProduct

    function lowProduct() {
        console.log("\033c");
        connection.query("SELECT * FROM products WHERE stock_quantity < 5 ORDER BY stock_quantity ASC", function (err, res) {
            if (!res.length) {
                console.log("\nAll items are stocked at a quantity of 5 or more.\n");
            } else {
                console.table(res);
            }
            console.log("\n");
            mainMenu();
        }); //query
    } //end lowProduct

    function addInventory() {
        console.log("\033c");

        inquirer.prompt([{
                name: "id",
                type: "input",
                message: "Enter the Id of the Item you would like to add inventory: ",
                validate: answer => {
                    if (answer.match(/^[1-9]\d*$/)) {
                        return true;
                    } else {
                        return "Please enter a positive integer.";
                    }
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many to add to stock quantity: ",
                validate: answer => {
                    if (answer.match(/^[1-9]\d*$/)) {
                        return true;
                    } else {
                        return "Please enter a positive integer.";
                    }
                }
            }
        ]).then(function (userIn) {

            var query = connection.query("SELECT * FROM products WHERE item_id=?", userIn.id, function (err, res) {
                if (!res.length) {
                    console.log("\n" + userIn.id + "  Item id not found\n");
                } else {
                    var sum = parseInt(res[0].stock_quantity) + parseInt(userIn.quantity);
                    var query = connection.query("UPDATE products SET ? WHERE ?", [{
                            stock_quantity: sum
                        },
                        {
                            item_id: userIn.id
                        }
                    ]);
                    console.log("\nItem " + userIn.id + "  " + res[0].product_name +
                        " quantity updated from " +
                        res[0].stock_quantity + " to " + sum + "\n");
                }
                mainMenu();
            }); //query
        }); //.then
    } // function addInventory

    function addProduct() {
        console.log("\033c");

        inquirer.prompt([{
                name: "addId",
                type: "input",
                message: "Enter the Id of the Item you would like to add: ",
                validate: answer => {
                    if (answer.match(/^[1-9]\d*$/)) {
                        return true;
                    } else {
                        return "Please enter a positive integer.";
                    }
                }
            },
            {
                name: "prod_name",
                type: "input",
                message: "Enter product name: "
            },
            {
                name: "dept",
                type: "input",
                message: "Enter department name: "
            },
            {
                name: "price",
                type: "input",
                message: "Enter price: $",
                validate: answer => {
                    if (answer.match(/^[+-]?[1-9][0-9]{0,2}(?:(,[0-9]{3})*|([0-9]{3})*)(?:\.[0-9]{2})?$/)) {
                        return true;
                    } else {
                        return "Please enter a price.";
                    }
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "quantity: ",
                validate: answer => {
                    if (answer.match(/^[1-9]\d*$/)) {
                        return true;
                    } else {
                        return "Please enter a positive integer.";
                    }
                }
            }
        ]).then(function (input) {

            var query = connection.query("INSERT INTO products SET ?", {
                item_id: input.addId,
                product_name: input.prod_name,
                department_name: input.dept,
                price: input.price,
                stock_quantity: input.quantity
            }, function (err, res) {
                if (err) {
                    console.log("\nUnable to add, Id not valid, Remember no duplicates\n");
                } else {
                    console.log("\nItem added\n")
                }
                mainMenu();
            }); //query
        }); //.then
    } //function addProduct


    function mainMenu() {
        inquirer.prompt([{
            name: "action",
            type: "list",
            message: "Choose Action?",
            choices: [
                "View Products for Sale",
                "View Low Inventory < 5",
                "Add to Inventory",
                "Add New Product",
                "Back to Main Menu",
                "Exit Menu"
            ]
        }]).then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    allProduct();
                    break;
                case "View Low Inventory < 5":
                    lowProduct();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addProduct();
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



    /////////////Starts Here////////////
    connection.connect(function (err) {
        if (err) throw err;
        console.log("\033c");
        mainMenu();
    });

} //function bamaxonManager
module.exports.bamazonManager = bamazonManager;