//dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var axios = require('axios');


//var History = require('./models/history.js');

// Express
var app = express();
var PORT = process.env.PORT || 3000; // Sets an initial port. We'll use this later in our listener

// body parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.use(express.static('./public'));

// -------------------------------------------------

// MongoDB 
mongoose.connect('mongodb://localhost/address'); //change url
var db = mongoose.connection;

db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
});

db.once('open', function() {
    console.log('Mongoose connection successful.');
});


// -------------------------------------------------

// Main Route. 
app.get('/', function(req, res) {
    res.sendFile('./public/index.html');
})

//  GET requests
app.get('/api/', function(req, res) {
    // GET request will search for the latest clickCount
    var newHistory = new History(req.body);
    console.log(req.body);
    History.find({})
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.send(doc);
            }
        })
});

// POST requests 
app.post('/api/', function(req, res) {
    var newAddress = new History(req.body);
    console.log(req.body);

    var location = req.body.location;
    var date = parseInt(req.body.date);

    History.findOneAndUpdate({
        "location": location
    }, {
        $set: {
            "location": location,
        }
    }, {
        upsert: true
    }).exec(function(err) {

        if (err) {
            console.log(err);
        } else {
            res.send("Updated Address!");
        }
    });

});


// -------------------------------------------------

// Listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});