var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "bamazon_db"
});

function startMang() {
    inquirer.prompt([{
        message: "What would you like to do?",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        name: "options"
    }]).then(function (response) {
        switch (response.options) {
            case "View Products for Sale":
                console.log("About to connect");
                connection.query("SELECT * FROM products", function (err, res) {
                    if (err) throw err;
                    for (i = 0; i < res.length; i++) {
                        console.log("----------------------------------------------");
                        console.log("        Item number: " + res[i].item_id);
                        console.log("        Item name: " + res[i].product_name);
                        console.log("        Price per unit: " + res[i].price);
                        console.log("        How many are left? " + res[i].stock_quantity);
                        console.log("----------------------------------------------");

                    }
                })
                break;
            case "View Low Inventory":
                connection.query("SELECT * FROM products where stock_quantity<5", function (err, res) {
                    if (err) throw err;
                    for (i = 0; i < res.length; i++) {
                        console.log(res[i]);
                    }
                });
                break;
            case "Add to Inventory":
                inquirer.prompt([{
                        message: "What product number would you like to update?",
                        name: "productID"
                    },
                    {
                        message: "How many would you like to add?",
                        name: "productAmount"
                    }
                ]).then((response) => {
                    console.log("Test");
                    var productID = response.productID;
                    var productAmount = response.productAmount;
                    console.log(productID);
                    console.log(productAmount);
                    connection.query("update products set stock_quantity = ? where item_id = ?", [productAmount, productID], function (err, res) {
                        console.log("Product updated");
                    });
                });
                break;
            case "Add New Product":
                inquirer.prompt([{
                        message: "What is the name of the product you would like to add?",
                        name: "productName"
                    },
                    {
                        message: "What department does the product belong to?",
                        name: "productDepartment"

                    },
                    {
                        message: "What is the price of the product you would like to add?",
                        name: "productPrice"
                    },
                    {
                        message: "What is the quantity of product you would like to add?",
                        name: "productAmount"

                    }
                ]).then(function (res) {
                    connection.query("INSERT INTO products SET?",
                        [{
                            product_name: res.productName,
                            department_name: res.productDepartment,
                            price: res.productPrice,
                            stock_quantity: res.productAmount
                        }],
                        function (err) {
                            if (err) throw err;
                        });
                    console.log("product added")
                });
                break;
        };
    });
};

connection.connect(function (err) {
    if (err) throw err;
});
startMang();