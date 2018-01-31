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

function managerView(){
  console.log(`${colors.rainbow("KABAMAZON")}
  Our products on offer. 
  Remember, your EoFY bonus hangs on getting products out the door.
  `);
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
        viewProducts();
        break;
      case "View items low in stock":
        viewLowStock();
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
function viewProducts() {
  console.log(`${colors.rainbow("KABAMAZON")} Product View:
  Remember: Your bonus depends on moving inventory out!
  We are all about the bottom line here. Give up the family.`);
    
  connection.query("SELECT * FROM products", function(err, res){
    //instatiate the table:
    var table = new Table({
      head: ['ID', 'Item', 'Price', 'Qty'], 
      colWidths: [5, 40, 15, 10]
    });

    if (err) throw err;

    for (var i = 0; i < res.length; i++) {  
      let qty = res[i].stock_quantity;
      if(qty < 5){
        qty = colors.magenta(qty)
        }
      table.push(
        [res[i].item_id, res[i].product_name, res[i].price, qty]
        )
      };
      console.log(table.toString());
      setTimeout(()=>{
        managerView();
      }, 1000);
  })
}

function viewLowStock(){
  console.log(`
  **********${colors.red("ORDER SOON!")}**********
  the following are items below par (5):`);
  connection.query("SELECT * FROM products WHERE stock_quantity <5;", function(err, res){
    //instatiate the table:
    var table = new Table({
      head: ['ID', 'Item', '< 5'], 
      colWidths: [5, 40, 10]
    });

    if (err) throw err;

    for (var i = 0; i < res.length; i++) {  
      let qty = res[i].stock_quantity;
      table.push(
        [res[i].item_id, res[i].product_name, colors.red(qty)]
        )
      };
      console.log(table.toString());
      setTimeout(()=>{
        managerView();
      }, 1000);
  })

}
/*Manager View (Next Level)

Create a new Node application called bamazonManager.js. Running this application will:

$$$$$ SWITCH: List a set of menu options:

[✔]View Products for Sale viewProducts();
the app should list every available item: the item IDs, names, prices, and quantities.

[]View Low Inventory viewLowStock();
then it should list all items with an inventory count lower than five.

[]Add to Inventory addToStock();
your app should display a prompt that will let the manager "add more" of any item currently in the store.

[]Add New Product addNewProduct();
it should allow the manager to add a completely new product to the store.





If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.

If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

----*/

managerView();