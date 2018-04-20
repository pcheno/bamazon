var inquirer = require("inquirer");

let customer = require("./bamazonCustomer.js");
let manager = require("./bamazonManager.js");
let supervisor = require("./bamazonSupervisor.js");

// main menu for Bamazon
function bamazonMenu() {
    console.log("\033c");

    console.log("\nBamazon Main Menu\n");
    // prompt for various roles
    inquirer.prompt([
        {
            type: "list",
            name: "functions",
            message: "What is your role?",
            choices: [
                "Customer",
                "Manager",
                "Supervisor",
                "Exit menu"
            ]
        }
    ]).then(function (userChoice) {
        // switch to call the various files/functions depending on user input
        switch (userChoice.functions) {
            case "Customer":
                customer.bamazonCustomer();
                break;
            case "Manager":
                manager.bamazonManager();
                break;
            case "Supervisor":
                supervisor.bamazonSupervisor();
                break;
            case "Exit menu":
                console.log("\033c");
                console.log("\ngood bye")
                //return;
                break;
        }
    });
}

// initial call for the main menu
bamazonMenu();

// export the main menu so that other pages can come back to it
module.exports.bamazonMenu = bamazonMenu;
