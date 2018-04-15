var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Pcheny02",
    database: "bamazon"
});


function allProduct() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("\n" + "-".repeat(100) + "\n" + res[i].product_name + "\nUnique item ID: " + res[i].item_id + "\nDepartment: " + res[i].department_name + "\nPrice: " + "$" + res[i].price + "\nQuantity: " + res[i].stock_quantity);
        }
        
    });
}

allProduct();

connection.end();