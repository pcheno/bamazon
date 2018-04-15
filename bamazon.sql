DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INTEGER NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (10101, "walkman", "electronics", 100.00, 20);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (20202, "turn table", "electronics", 130.00, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (30303, "tape deck", "electronics", 80.00, 5);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (40404, "tennis shoes", "clothing", 60.00, 1);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (50505, "tube top", "clothing", 10.00, 1000);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (60606, "bell bottom jeans", "clothing", 50.00, 20);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (70707, "ham sandwich", "food", 2.00, 15);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (80808, "cheese log", "food", 1.50, 4);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (90909, "newsweek", "periodical", 1.00, 40);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (11111, "time", "periodical", 1.75, 37);
