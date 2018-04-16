require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

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
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("\n" + "+".repeat(50) + "\n" + res[i].product_name + "\nItem Id: " + res[i].item_id + "\nDepartment: " + res[i].department_name + "\nPrice: " + "$" + res[i].price + "\nQuantity: " + res[i].stock_quantity);
        }
    });
} //end allProduct

function lowProduct() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5 ORDER BY stock_quantity ASC", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("\n" + "+".repeat(50) + "\n" + res[i].product_name + "\nItem Id: " + res[i].item_id + "\nDepartment: " + res[i].department_name + "\nPrice: " + "$" + res[i].price + "\nQuantity: " + res[i].stock_quantity);
        }
    });
} //end lowProduct



function addProduct() {
    inquirer.prompt([{
            name: "addId",
            message: "Enter the Id of the Item you would like to add: "
        },
        {
            name: "prod_name",
            message: "Enter product name: "
        },
        {
            name: "dept",
            message: "Enter department name: "
        },
        {
            name: "price",
            message: "Enter price: $"
        },
        {
            name: "quantity",
            message: "quantity: "
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
                console.log("\nDuplicate item id, unable to add");
            } else {
                console.log("\nItem added")
            }
            // connection.end();
        }); //query
    });
} //function addproduct

function addInventory() {
    inquirer.prompt([{
            name: "id",
            message: "Enter the Id of the Item you would like to add inventory: "
        },
        {
            name: "quantity",
            message: "How many to add to stock quantity: "
        }
    ]).then(function (userIn) {
        var query = connection.query("SELECT * FROM products WHERE item_id=?", userIn.id, function (err, res) {
            if (res[0] == undefined) {
                console.log("Item id not found");
            } else {
                var sum = parseInt(res[0].stock_quantity) + parseInt(userIn.quantity);
                var query = connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: sum
                    },
                    {
                        item_id: userIn.id
                    }
                ]);
                console.log("Item " + userIn.id +" quantity updated " + sum);
            }

            connection.end();
        }); //query
    });
}

/////////////////////////////
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    addInventory();
});