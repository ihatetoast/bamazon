const mysql = require('mysql');
const inquirer = require('inquirer');
const colors = require('colors/safe');
var Table = require('cli-table');

console.log(`${colors.rainbow("WELCOME TO KABAMAZON")}!
Where devs git divine duds.
`);


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazonDB"
});

var table = new Table({
  head: ['ID', 'Item', 'Price']
, colWidths: [5, 40, 15]
});
//show the customer what is available
connection.connect(function(err) {
  if (err) throw err;
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {  
      table.push(
        [res[i].item_id, res[i].product_name, res[i].price]
      )
    }
    console.log(table.toString());
    goShopping();
  })
});

//ask customer for the id of what they want to buy and then how much of that product they want

//with the id and qty, see if store has enough 
//if not enough, colo there's not enough and return
//if there is, fulfill order:
//   subtract amount purchased from qty
//   multiply qty cust bought times price and add TX sales tax

//function GOSHOPPING gets cust order and checks if there's enough

function goShopping(){
  inquirer
  .prompt([
    {
      name: 'id',
      message: 'What is the id of the item you\'d like to buy?',
      validate: function(val){
        if(isNaN(val)){
          return 'Please enter a number';
        }
        else {
          return true;
        }
      }
    },
    {
      name: 'qty',
      message: 'How many would you like to purchase?',
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
    console.log(`Customer wants ${answers.qty} of item #${answers.id}`);
    //get qty of id from db
    connection.query("SELECT * FROM products WHERE ?", { item_id: answers.id }, function(err, res) {
      var custQty = answers.qty;
      var itemId = answers.id;
      var stockQty = res[0].stock_quantity;
      var price = res[0].price;
      if(err){
        console.log(`We are sorry, but product #${answers.id} is not a valid ID`);
        goShopping();
      }
      if(custQty > stockQty){
        console.log(`We are sorry, but there is insufficient quantity in stock at the moment.`);
        newOrder();
      }
      else {
        console.log(`Customer wants ${custQty} and we have ${stockQty}`);
        //capture cust's qty and subtract from stock
        //update table with new qty
        //capture cust's qty and multiply times price and .0625
        let query = "UPDATE products SET ? WHERE ? ";
        connection.query(query, [{stock_quantity: stockQty - custQty},{item_id: answers.id}], function(err, res) {
            console.log(res);
          // res[0].stock_quantity
        });
        const date = new Date();
        console.log(`Kamazon receipt:
        Date: ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}
        Cashier: KatyCa
        item: ${itemId}
        qty: ${custQty}
        price: ${price}`);
        const subTotal = custQty * price;
        const tax = subTotal * 0.0625;
        const total = subTotal + tax;
        console.log(`total is ${total}`);
      }
    });
  } )
}


function newOrder(){
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'shop',
        message: 'Would you like to make another order?'
      }
    ])
    .then((answers) =>{
      if(answers.shop){
        goShopping();
        return;
      }else{
        console.log('Come back soon.');
        return;
      }
    })
}
// UPDATE products
// SET stock_quantity = 1
// WHERE id = 1;

  
  
/**
 * 
 * The app should then prompt users with two messages.

The first should ask them the ID of the product they would like to buy.
The second message should ask how many units of the product they would like to buy.

Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

However, if your store does have enough of the product, you should fulfill the customer's order.
This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, show the customer the total cost of their purchase.

 * 
 */