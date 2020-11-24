'use strict';
// --- Stuff
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;
const app = express();
const passport = require('./utils/passport');

// --- Routes
const rootRoute = require('./routes/rootRoute');
const userRoute = require('./routes/userRoute');
const adRoute = require('./routes/adRoute');
const authRoute = require('./routes/authRoute');


// --- Setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());

app.use('/', rootRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/ad', adRoute );

// ---
app.listen(port, () => console.log(`Example app listening on port ${port}!`));