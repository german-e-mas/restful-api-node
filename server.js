// Call the required packages.
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var User = require('./app/models/user');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    next();
}

// Configure app to use bodyParser(). This will let us get the data from a POST
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

// Routes for our API - Express Router
var router = express.Router();

// Middleware to use for all requests
router.use(function(req, res, next) {
    console.log('Something is happening.');
    // Make sure we go to the next routes and don't stop here.
    next();
});

// Test route to make sure everything is working (accessed at GET http://localhost:8080/api).
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// More routes for our API will happen here.

// On routes that end in /users
router.route('/users')
  // Create a user (accessed at POST http://localhost:8080/api/users)
  .post(function(req, res) {
    var user = new User();
    user.name = req.body.name;

    user.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'User created!'})
    })
  })

  // Get all the users (accessed at GET http://localhost:8080/api/users)
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err)
        res.send(err);
      res.json(users);
    });
  });

// On routes that end in /users/:user_id
router.route('/users/:user_id')
  // Get a user with the given ID (accessed at GET http://localhost:8080/api/users/:user_id)
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err)
        res.send(err);
      res.json(user);
    })
  })

  // Update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
  .put(function(req, res) {
    // Use our user model to find the user we want.
    User.findById(req.params.user_id, function(err, user) {
      if (err)
        res.send(err);
      user.name = req.body.name;
      // Save the user.
      user.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'User updated!' });
      })
    })
  })

  // Delete the user with the given ID (accessed at DELETE http://localhost:8080/api/users/:user_id)
  .delete(function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if (err)
        res.send(err);
      res.json({ message: 'Successfully deleted' });
    });
  });

// Register our Routes.
// All of our routes will be prefixed with /api
app.use('/api', router);

// Start the Server.
app.listen(port);
console.log('Magic happens on port ' + port);
