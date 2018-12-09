var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user:"root",
    password:"12345678",
    database: "bamazon_db"
});

function startBam(){
    connection.query(`SELECT * FROM products`, function(err, res){
        if(err)throw err;
        console.log(res);
        inquirer.prompt([
            {
                message: "Please enter the item ID number that you wish to purchase.",
                name: "productID"
            },
            {
               message:"How many units would you like to purchase?",
               name:"numberOfUnits"
            }
        ]).then( function(res){
            connection.query("SELECT stock_quantity FROM products WHERE item_ID=?", [res.productID], function(err, response){
                if (err) throw err;
                console.log(`There are currently ${response[0].stock_quantity} in stock.`);
                console.log(`You've requested ${res.numberOfUnits} units.`);
                if(response[0].stock_quantity > res.numberOfUnits){
                    connection.query(`UPDATE products set ? WHERE ?`,[{stock_quantity: (response[0].stock_quantity - res.productID)}, {item_id: res.productID}]);
                    console.log("Purchase complete!")
                }

            });
        });
    
        
    });
}

startBam();