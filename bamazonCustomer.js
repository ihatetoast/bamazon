const mysql = require('mysql');
const inquirer = require('inquirer');
const colors = require('colors/safe');
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazonDB"
});
var table = new Table({
  head: ['ID', "Product", 'Department', 'Price', 'Qty']
, colWidths: [5, 30, 30, 10, 5]
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("boop from bamazonCustomer");
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {  
      let qty = res[i].stock_quantity;
      if(qty < 5){
        qty = colors.magenta(qty)
       }
      table.push(
        [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, qty]
      )
    }
    console.log(table.toString());
  })
});

module.exports = connection;