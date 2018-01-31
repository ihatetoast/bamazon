const mysql = require('mysql');
const inquirer = require('inquirer');
const colors = require('colors/safe');
var Table = require('cli-table');



function inviteToShop(){
  console.log(`${colors.rainbow("WELCOME TO KABAMAZON")}!
  Where devs git divine duds.
  `);
  inquirer
  .prompt([
    {
      name: 'shop',
      type: 'confirm',
      message: 'Hello. Would you like to make a purchase?'
    }
  ])
  .then((answer) => {
    if(!answer.shop){
      console.log("Ok. Hope you change your mind soon.");
    }
    else{
      goShopping();
    }
  })
}

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

var table = new Table({
  head: ['ID', 'Item', 'Price'], 
  colWidths: [5, 40, 15]
});

//show the customer what is available
function goShopping(){
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {  
      table.push(
        [res[i].item_id, res[i].product_name, (res[i].price).toFixed(2)]
      )
    }
    console.log(table.toString());
    inquirer
    .prompt([
      {
        name: 'id',
        message: 'What is the id of the item you\'d like to buy?',
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
      connection.query("SELECT * FROM products WHERE ?", { item_id: answers.id }, function(err, res) {
        if(err){ 
          console.log("Oops. Something has gone wrong. We will fire the dev.");
        }
        var custQty = answers.qty;
        var itemId = answers.id;
        var stockQty = res[0].stock_quantity;
        var price = res[0].price;
        const subTotal = custQty * price;
        const tax = subTotal * 0.0625;
        const ttl = subTotal + tax;
        const total = ttl.toFixed(2);
        
        if(custQty > stockQty){
          console.log(`We are sorry, but there is insufficient quantity in stock at the moment.`);
          continueShopping();
          return false;
        }
        else {
          let query = "UPDATE products SET ? WHERE ? ";
          connection.query(query, [{stock_quantity: stockQty - custQty},{item_id: answers.id}], function(err, res) {
            const date = new Date();
            console.log(`
            ${colors.rainbow("KABAMAZON receipt:")}
            Timestamp: ${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
            Cashier: KatyCa001
            item: ${itemId}
            qty: ${custQty}
            price: ${price.toFixed(2)}
            sub: ${subTotal.toFixed(2)}
            tax: ${tax.toFixed(2)}
            ${colors.rainbow("total:")} ${total}
            `);
          });
          setTimeout(()=>{
            continueShopping();
          }, 1500);
        }
      });
    } )
    // }
  })
}
//ask customer for the id of what they want to buy and then how much of that product they want

//with the id and qty, see if store has enough 
//if not enough, colo there's not enough and return
//if there is, fulfill order:
//   subtract amount purchased from qty
//   multiply qty cust bought times price and add TX sales tax

//function GOSHOPPING gets cust order and checks if there's enough




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
//shop again? like restart

function continueShopping(){
  inquirer
  .prompt([
    {
      type: "confirm",
      name: "continue",
      message: "Continue shopping?"
    }
  ])
  .then((answer) => {
    if(answer.continue){
      goShopping()
    }
    else {
      connection.end();
    }
  })
}

inviteToShop();