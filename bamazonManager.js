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
            connection.query("SELECT * FROM products where stock_quantity<5", function(err, res){
                if(err) throw err;
                for(i=0; i<res.length; i++){
                    console.log(res[i]);
                }
            })
                break;
            case "Add to Inventory":
                break;
            case "Add New Product":
                break;
        };
    });
};

connection.connect(function(err){
    if(err) throw err;
});
startMang();