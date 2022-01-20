# Logistico 🛠️ 
Your One-Stop-Shop for Everything Inventory and Logistics

[Go to Logistico](https://logistico-app.herokuapp.com/)

## About
Logistico was built for Shopify's Summer 2022 Backend Developer Intern Challenger! The app aims to help companies monitor and update their inventory to stay on top of their operations.

## Tech Stack
Logistico was developed using a ReactJS frontend, a NodeJS backend, and a MongoDB database. 

## Key Features
* Create an Inventory Item
* View an Inventory Item
* Edit an Inventory Item
* Delete an Inventory Item
* View all Inventory Items

## Special Feature: Upload Images and Store Images with Generated Thumbnails
Each inventory item has its associated inventory item image that can be uploaded by a Logistico employee. When the image is uploaded, a smaller image is created as a thumbnail of the image. This feature uses MongoDB's GridFS API, which allows users to upload files of unlimited size and stores the file in chunks.

## How to Run Locally

Pre-Requisites:
1. Make sure you have node and npm installed.  [Instructions linked](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
2. Download MongoDB. [Instructions linked for each OS](https://docs.mongodb.com/manual/administration/install-community/)
3. Create a ```.env``` file specifying the ```MONGO_URI``` in project's root directory. 

To Run:
1. Clone this repository
2. ```npm install``` in root directory 
3. ```cd client && npm install```
4. Go back to root directory (```cd ..```) and run ```npm run start```

## How I Tested
I used Postman to test the different endpoints of Logistico. Here they are for your reference. <br> <br> [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/49d5147b2ab6bd889b11?action=collection%2Fimport)
