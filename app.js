const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const app = express();

app.use(bodyParser.json());

const routes = require('./routes'); // Import the routes
const { MongoClient } = require('mongodb');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.use('/api', routes); // Use the routes

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const url = "mongodb://user_453vzgpb9:p453vzgpb9@db01.dbhost.dev:5050/db_453vzgpb9";

const client = new MongoClient(url);

const dbName = "db_453vzgpb9";
async function main(){
    try{
        // 1) Insert products 
        await client.connect();
        const db = client.db(dbName);
        const products = db.collection("products");
        const productData = [
            {
                productId: "P001",
                productName: "Laptop",
                category: "Electronics",
                price: 65000,
                quantity: 10,
                supplier: "Dell"
            },
            {
                productId: "P002",
                productName: "Keyboard",
                category: "Electronics",
                price: 1500,
                quantity: 25,
                supplier: "Logitech"
            },
            {
                productId: "P003",
                productName: "Office Chair",
                category: "Furniture",
                price: 8500,
                quantity: 15,
                supplier: "GreenSoul"
            },
            {
                productId: "P004",
                productName: "Monitor",
                category: "Electronics",
                price: 18000,
                quantity: 12,
                supplier: "Samsung"
            },
            {
                productId: "P005",
                productName: "Desk",
                category: "Furniture",
                price: 12000,
                quantity: 8,
                supplier: "IKEA"

    }
        
        ];

        await products.insertMany(productData);
        //2) Display products of a specific category

        const Electronics = await products.find({category: "Electronics"}).toArray();
        console.log(Electronics)
        
        //3) Find one product 

        console.log("Finding one product");
        const oneProduct = await products.findOne({
            productId: "P001"
        });

        console.log(oneProduct);
        // 4. DISPLAY ONLY PRODUCT NAME, PRICE AND QUANTITY


        console.log("\n4. Product name, price and quantity:");

        const selectedProducts = await products
            .find({})
            .project({
                _id: 0,
                productName: 1,
                price: 1,
                quantity: 1
            })
            .toArray();

        console.log(selectedProducts);


        // 5. UPDATE PRICE AND QUANTITY USING updateOne()


        const updateResult = await products.updateOne(
            { productId: "P001" },
            {
                $set: {
                    price: 68000,
                    quantity: 8
                }
            }
        );

        console.log("\n5. Price and quantity updated using updateOne().");
        console.log("Documents modified:", updateResult.modifiedCount);


        // 6. UPDATE A PRODUCT USING ITS productId

        await products.updateOne(
            { productId: "P002" },
            {
                $set: {
                    productName: "Mechanical Keyboard",
                    supplier: "Logitech India"
                }
            }
        );

        console.log("\n6. Product updated using productId P002.");


        // 7. DELETE ONE PRODUCT USING ITS productId

        const deleteResult = await products.deleteOne({
            productId: "P005"
        });

        console.log("\n7. Product P005 deleted.");
        console.log("Documents deleted:", deleteResult.deletedCount);


        // 8. DISPLAY FINAL PRODUCT RECORDS

        console.log("\n8. Final product records:");

        const finalProducts = await products.find({}).toArray();

        console.log(finalProducts);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        // Close connection
        await client.close();
        console.log("\nMongoDB connection closed.");
    }
}

main();
