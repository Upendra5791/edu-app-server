import express from 'express';
import { urlencoded, json } from 'body-parser';
import routes from './routes/routes';
import expressJwt from 'express-jwt';

const app = express();
const PORT = process.env.PORT || 3000;

/* const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(); */

// mongoose connection
import { connect } from 'mongoose';
const url = 'mongodb+srv://upenz5791:NDJlN6ekntUrt7n6@cluster0.xloz3.mongodb.net/MEANMDB?retryWrites=true&w=majority';
const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
connect(url, connectionParams)
    .then(() => {
        console.log('Connected to database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

// body parser setup
app.use(urlencoded({ extended: true }));
app.use(json({ extended: true }));
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
routes(app);

app.get('/', (req, res) => {
    res.send(`Node and express servers running on port ${PORT}`);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

// Expose the API as a function
// exports.api = functions.https.onRequest(app);