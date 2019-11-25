
//libraries imported
const router = require('express').Router();
let User = require('../models/user.model');

//just a list to make it easier to add the "strengths" property
let topics = ["General Knowledge","Entertainment: Books","Science and Nature","Geography","Mythology","Art","History","Entertainment: Musicals and Theaters"]

//route to find all users in the database
router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

//route to add a user to the database and set all their strengths to 1 and set their preferences
router.route('/add').post((req, res) => {
  const username = req.body.username;
  let strengths = {}
  for(topic in topics){
    strengths[topics[topic]] = 1
  }
  let prefs = {
    numOfQ: 2,
    difficulty: "hard",
    topic: "General Knowledge"
  }
  const newUser = new User({username, strengths, prefs});
  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//route to find a user by their specific MongoDB ID
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
      .then(user => res.json(user))
      .catch(err => res.status(400).json('Error: ' + err));
});

//route to find a user by their username
router.route('/:username').get((req, res) => {
  User.findById(req.params.username)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

//route to update the strengths of a user
router.route('/updatestrengths/:username').post((req, res) => {
    User.updateOne({username:req.params.username}, {strengths:req.body.strengths}).then(console.log("success"))
});

//route to updtate the preferences of a user
router.route('/updateprefs/:username').post((req, res) => {
  User.updateOne({username:req.params.username}, {prefs: req.body}).then(console.log("success"))
});
  
//exporting these routes to be used
module.exports = router;