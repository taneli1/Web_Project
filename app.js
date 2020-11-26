'use strict';

// TODO Secure user route, reputation posting
//  - Foreign keys
//  - Table for Reputation
//  - Image Uploads
//  - Separate table which keeps track of user ads?

// --- Stuff
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;
const app = express();
const passport = require('./backend/utils/passport');

const session = require('express-session')
const cookieParser = require('cookie-parser')

// --- Routes
const rootRoute = require('./backend/routes/rootRoute');
const userRoute = require('./backend/routes/userRoute');
const adRoute = require('./backend/routes/adRoute');
const authRoute = require('./backend/routes/authRoute')

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 10 * 1000}
}));

// --- Setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());

app.use('/', rootRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/ad', adRoute );

app.use(bodyParser.urlencoded({extended: true}));

app.get('/setCookie/:clr', (req, res) => {
  res.cookie('color', req.params.clr, {}).send('something');
});

// ---
app.listen(port, () => console.log(`Example app listening on port ${port}!`));