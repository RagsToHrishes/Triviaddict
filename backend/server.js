//Importing libraries to use

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//Setting up environment variables with the .env file
require('dotenv').config();

if(process.env.NODE_ENV === "production"){
  app.use(express.static("../triviaddict/build "))
  app.get("*", (req,res) => {
    res.sendFile(path.resolve(__dirname, "../triviaddict", "build", "index.html"))
  })
}

//Setting up the app and port
const app = express();
const port = process.env.PORT || 5000;

//Using cors to easily communicate and express.json to interpret packages from MongoDB as json
app.use(cors());
app.use(express.json());

//Connecting to my MongoDB database
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true}
)
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//Setting up the router for the /user page
const usersRouter = require('./routes/user');
app.use('/user', usersRouter);


//Starting the app by making it listen on this port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});