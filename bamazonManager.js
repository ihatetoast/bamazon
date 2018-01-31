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
      choices: ["View products", "View items low in stock", "Add to stock", "Add a new product to your stock", "Close program"]
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
        addToStock()
        break;
      case "Add a new product to your stock":
        addNewProduct()
        break;
      case "Close program":
        connection.end()
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
  showTable();
  setTimeout(()=>{
    managerView();
  }, 1500);
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
      }, 1500);
  })

}

function addToStock(){  
  showTable();
  console.log(`***** ${colors.green("Add to stock")} *****`);
  connection.query("SELECT * FROM products", function(err, res){
    inquirer
    .prompt([
      {
        name: "item",
        message: "Select item to add stock to: \n",
        validate: function(val){
          if(isNaN(val)){
            return 'Please enter a number';
          }else if(val > res.length){
            return 'I am sorry, but you have entered an incorrect ID.'
          }
          else {
            return true;
          }
        }
      },
      {
        name: "amount",
        message: "How much are you adding?",
        validate: function(val){
          if(isNaN(val)){
            return 'Please enter a number';
          }
          else {
            return true;
          }
        }
      }
    ])
    .then((answers) => {
      // console.log(typeof qty);//returns string
      let qty = parseInt(answers.amount);
      //item_id is one off of index bc of 0
      let item = answers.item -1;
      console.log(`You want to add ${qty} to ${answers.item}`);
      
      connection.query("UPDATE products SET ? WHERE ?;", [
        {stock_quantity: res[item].stock_quantity + qty}, 
        {item_id: answers.item} 
      ])
      console.log(`${colors.green("SUCCESS!")}`);
      setTimeout(()=>{
        console.log(`${res[item].product_name} is now ${(res[item].stock_quantity) + qty}`);
        showTable();
        setTimeout(()=>{
          addMore();
        }, 1000);
        
      }, 1000);
    })
  })
}
function addMore(){
  inquirer
    .prompt({
      type: "confirm",
      name: "addMore",
      message: "Would you like to add more stock?"
    })
    .then((answer)=>{
      if(answer.addMore){
        addToStock();
      }
      else {
        managerView();
      }
    })
}
// }
// function addNewProduct(){
//   console.log("Add new product fired");
// }
// function addToStock(){

// }
/*Manager View (Next Level)

Create a new Node application called bamazonManager.js. Running this application will:

$$$$$ SWITCH: List a set of menu options:

[✔]View Products for Sale viewProducts();
the app should list every available item: the item IDs, names, prices, and quantities.

[✔]View Low Inventory viewLowStock();
then it should list all items with an inventory count lower than five.

[✔]Add to Inventory addToStock();
your app should display a prompt that will let the manager "add more" of any item currently in the store.

[]Add New Product addNewProduct();
it should allow the manager to add a completely new product to the store.





If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.

If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

----*/

//table fcn needed more than once
function showTable(){
  connection.query("SELECT * FROM products", function(err, res){
    //instatiate the table:
    var table = new Table({
      head: ['ID', 'Item', 'Price', 'Qty'], 
      colWidths: [5, 35, 15, 10]
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
  })
}

managerView();

