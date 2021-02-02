'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _routes = require('./routes/routes');

var _routes2 = _interopRequireDefault(_routes);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _mongoose = require('mongoose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var PORT = 3000;

/* const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(); */

// mongoose connection

var url = 'mongodb+srv://upenz5791:NDJlN6ekntUrt7n6@cluster0.xloz3.mongodb.net/MEANMDB?retryWrites=true&w=majority';
var connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};
(0, _mongoose.connect)(url, connectionParams).then(function () {
    console.log('Connected to database ');
}).catch(function (err) {
    console.error('Error connecting to the database. \n' + err);
});

// body parser setup
app.use((0, _bodyParser.urlencoded)({ extended: true }));
app.use((0, _bodyParser.json)({ extended: true }));
//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

// serving static files
// app.use(static('public'));

// invoke the routes
(0, _routes2.default)(app);

app.get('/', function (req, res) {
    res.send('Node and express servers running on port ' + PORT);
});
app.listen(PORT, function () {
    console.log('Server is running on port ' + PORT);
});

// Expose the API as a function
// exports.api = functions.https.onRequest(app);