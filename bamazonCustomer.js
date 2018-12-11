var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "bamazon_db"
});

function startBam() {
    connection.query(`SELECT * FROM products`, function (err, res) {
        if (err) throw err;
     
        for(i=0; i<res.length; i++){
            console.log("------------------------");
            console.log("Item number: "+res[i].item_id);
            console.log("Item name: "+res[i].product_name);
            console.log("Department: "+res[i].department_name);
            console.log("Price per unit: "+res[i].price);
            console.log("How many are left? "+res[i].stock_quantity);
            console.log("------------------------");

        }
        inquirer.prompt([{
                message: "Please enter the item ID number that you wish to purchase.",
                name: "productID"
            },
            {
                message: "How many units would you like to purchase?",
                name: "numberOfUnits"
            }
        ]).then(function (res) {
            connection.query("SELECT * FROM products WHERE item_ID=?", [res.productID], function (err, response) {
                if (err) throw err;
                var price = response[0].price;
                console.log(price);
                console.log(`There are currently ${response[0].stock_quantity} in stock.`);
                console.log(`You've requested ${res.numberOfUnits} units.`);
                if (response[0].stock_quantity >= res.numberOfUnits) {
                    connection.query(`UPDATE products set ? WHERE ?`, [{
                        stock_quantity: (response[0].stock_quantity - res.numberOfUnits)
                    }, {
                        item_id: res.productID
                    }]);
                    console.log("Purchase complete!");
                    connection.query("SELECT price FROM products WHERE item_ID=?", [res.productID], function (response) {
                        console.log("Price: "+(price*res.numberOfUnits));
                        startBam();
                    })
                } else {
                    console.log("Insufficient inventory")
                }

            });
        });


    });
}
connection.connect((err)=>{
    if(err) throw err;
});
startBam();