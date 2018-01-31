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

connection.connect(function(err) {
  if (err) throw err;
});

/**
 * Challenge #3: Supervisor View (Final Level)

Create a new MySQL table called departments. Your table should include the following columns:

department_id

department_name

over_head_costs (A dummy number you set for each department)

Modify the products table so that there's a product_sales column
(how much of that item has sold)
!!and modify the bamazonCustomer.js app so that this value is updated with each individual products total revenue from each sale.
(add that total without tax to the column)
(how is this vv different?)
Modify your bamazonCustomer.js app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

Make sure your app still updates the inventory listed in the products column.



Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:

View Product Sales by Department

Create New Department (<-- Dude, this would affect the physical layout of the building. Not sure this is realistic.)

When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

| department_id | department_name | over_head_costs | product_sales | total_profit |
| ------------- | --------------- | --------------- | ------------- | ------------ |
| 01            | Electronics     | 10000           | 20000         | 10000        |
| 02            | Clothing        | 60000           | 100000        | 40000        |

The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.

If you can't get the table to display properly after a few hours, then feel free to go back and just add total_profit to the departments table.

Hint: You may need to look into aliases in MySQL.

Hint: You may need to look into GROUP BYs.

Hint: You may need to look into JOINS.
 */