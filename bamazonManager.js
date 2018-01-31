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
//is this the solution to my issues in customer?
connection.connect();

function managerView(){
  console.log(colors.red("This portal is for managers only."));
  inquirer
  .prompt([
    {
      type: "list",
      name: "manager",
      message: "Choose from list of tasks:",
      choices: ["View products", "View items low in stock", "Add to stock", "Add a new product to your stock"]
    }
  ])
  .then((answers) => {
    switch(answers.manager){
      case "View products":
        console.log("View products chosen");
        break;
      case "View items low in stock":
        console.log("View items low in stock chosen");
        break;
      case "Add to stock":
        console.log("Add to stock");
        break;
      case "Add a new product to your stock":
        console.log("Add a new product to your stock chosen");
        break;
      default:
        console.log("oops");
    }
  })
}
/*Manager View (Next Level)

Create a new Node application called bamazonManager.js. Running this application will:

$$$$$ SWITCH: List a set of menu options:

View Products for Sale viewProducts();
the app should list every available item: the item IDs, names, prices, and quantities.

View Low Inventory viewLowStock();
then it should list all items with an inventory count lower than five.

Add to Inventory addToStock();
your app should display a prompt that will let the manager "add more" of any item currently in the store.

Add New Product addNewProduct();
it should allow the manager to add a completely new product to the store.





If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.

If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

----*/

managerView();