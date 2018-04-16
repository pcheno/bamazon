
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
        buyItem();
    });
}
// function buyItem called from function allProduct
function buyItem() {
    inquirer.prompt([{
            name: "buyId",
            message: "Enter the Id of the Item you would like to purchase "
        },
        {
            name: "amount",
            message: "How many? "
        }
    ]).then(function (userIn) {
        var query = connection.query("SELECT * FROM products WHERE item_id=?", userIn.buyId, function (err, res) {

            if (userIn.amount > res[0].stock_quantity) {
                console.log("Insufficient quantity!");
            } else {
                var query = connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: res[0].stock_quantity - userIn.amount
                    },
                    {
                        item_id: userIn.buyId
                    }
                ]);
                console.log("\nThe total cost is $" + (userIn.amount * res[0].price).toFixed(2));        
            }
            connection.end();
        }); //query
    });
} //function buyItem
/////////////////////////////
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    allProduct();
});
