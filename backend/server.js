//Importing libraries to use

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');


//Setting up environment variables with the .env file
require('dotenv').config();


//Setting up the app and port
const app = express();

if(process.env.NODE_ENV === "production"){
  app.use(express.static("./triviaddict/build"))
  app.get("*", (req,res) => {
    res.sendFile("./triviaddict/build/index.html")
  })
}
//path.resolve(__dirname, "triviaddict", "build", "index.html")
const port = process.env.PORT || 4000;

//Using cors to easily communicate and express.json to interpret packages from MongoDB as json
app.use(cors());
app.use(express.json());

//Connecting to my MongoDB database
const uri = "mongodb+srv://hrish:cooldude678@cluster0-f9efk.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true}
)
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//Setting up the router for the /user page
const usersRouter = require('./routes/user');
app.use('/api/user', usersRouter);


//Starting the app by making it listen on this port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});