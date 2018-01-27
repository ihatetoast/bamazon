DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(6,2) NOT NULL,
  stock_quantity INT(3) NOT NULL,
  PRIMARY KEY (item_id)
);

--seed data
INSERT INTO products (product_name, department_name, price, stock_quantity)VALUES 
	("Angular jeans", "Women's", 105.50, 25),
  ("React jacket", "Men's", 120.00, 15),
  ("MySQNs", "Women's", 535.99, 3),
  ("Backend briefs", "Undergarments", 13.45, 24),
  ("UI shadow", "Cosmetics and perfume", 45.00, 50),
  ("Vue sunglasses", "Purses and accessories", 78.90, 6),
  ("Frontend frills", "Lingerie", 240.00, 5),
  ("NPM package", "Purses and accessories", 45.99, 10),
  ("Sassy pants", "Kids", 50.35, 15),
  ("Less lacy bits", "Lingerie", 40.00, 25),
  ("RGB eyeshadow palette", "Cosmetics and perfume", 40.40, 3)
   ;

SELECT * FROM products;

