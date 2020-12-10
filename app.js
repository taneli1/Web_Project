'use strict';

// --- Stuff
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const passport = require('./backend/utils/passport');

// --- Routes
const rootRoute = require('./backend/routes/rootRoute');
const userRoute = require('./backend/routes/userRoute');
const adRoute = require('./backend/routes/adRoute');
const authRoute = require('./backend/routes/authRoute');
const repRoute = require('./backend/routes/repRoute');


// --- Setup
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb'}));
app.use(express.static('public'));
app.use(cors());

// --- Server
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  require('./production')(app, process.env.PORT);
} else {
  require('./localhost')(app, process.env.HTTPS_PORT, process.env.HTTP_PORT);
}


app.use('/', rootRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/ad', adRoute);
app.use('/rep', repRoute);