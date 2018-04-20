function createNewDepartment() {
    console.log("\033c");
    inquirer.prompt([
        // take user input for department and overhead and validate input
        {
            name: "dept",
            message: "Please enter the new department's name"
        },
        {
            name: "overhead",
            message: "Please enter a valid cost with no dollar sign",
            validate: function (value) {
                let pass = value.match(
                    /^[+-]?[1-9][0-9]{0,2}(?:(,[0-9]{3})*|([0-9]{3})*)(?:\.[0-9]{2})?$/
                );
                if (pass) {
                    return true;
                }
                return 'Please enter a valid cost with no dollar sign';
            }
        }
    ]).then(function (input) {
        // query database to see if user input for department already exists 
        connection.query(
            "SELECT * FROM departments WHERE department_name=?", answers.department, function (err, res) {
                // if department name exists, send user back to supervisor menu
                if (res.length) {
                    console.log("\nThat department already exists. Please create a new one.".white.bgRed);
                    console.log("\nPress any key to return to the menu");
                    process.stdin.setRawMode(true);
                    process.stdin.resume();
                    process.stdin.once('data', function () {
                        console.log("\033c");
                        supervisorMenu();
                        process.exit.bind(process, 0);
                    });
                } else {
                    // otherwise, add department to departments table
                    console.log("\nAdding a new department...");

                    // query database to add new department and overhead costs into table
                    let query = connection.query(
                        "INSERT INTO departments SET ?",
                        {
                            department_name: answers.department,
                            over_head_costs: answers.overhead
                        },
                        function (err, res) {
                            console.log("\nYou added the following department:\n");

                            // array to hold table package information. Displays the new department and overhead to the user
                            data = [
                                ["Department".bold, "Overhead costs".bold],
                                [answers.department, "$" + parseFloat(answers.overhead).toFixed(2)]
                            ];

                            // set up configuration for table package
                            config = {
                                columns: {
                                    0: {
                                        alignment: 'left',
                                        minWidth: 10
                                    },
                                    1: {
                                        alignment: 'right',
                                        minWidth: 10
                                    }
                                },
                                border: {
                                    topBody: `─`,
                                    topJoin: `┬`,
                                    topLeft: `┌`,
                                    topRight: `┐`,

                                    bottomBody: `─`,
                                    bottomJoin: `┴`,
                                    bottomLeft: `└`,
                                    bottomRight: `┘`,

                                    bodyLeft: `│`,
                                    bodyRight: `│`,
                                    bodyJoin: `│`,

                                    joinBody: `─`,
                                    joinLeft: `├`,
                                    joinRight: `┤`,
                                    joinJoin: `┼`
                                }
                            };

                            // print the table
                            output = table.table(data, config);

                            console.log(output.white.bgBlue);

                            // go back to the supervisor menu
                            supervisorMenu();

                        }
                    );
                }
            }
        );
    });
}