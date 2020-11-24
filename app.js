'use strict';

// TODO Secure user route, reputation posting
// --- Stuff
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;
const app = express();
const passport = require('./backend/utils/passport');

// --- Routes
const rootRoute = require('./backend/routes/rootRoute');
const userRoute = require('./backend/routes/userRoute');
const adRoute = require('./backend/routes/adRoute');
const authRoute = require('./backend/routes/authRoute')


// --- Setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());

app.use('/', rootRoute);
app.use('/auth', authRoute)
app.use('/user', userRoute);
app.use('/ad', adRoute )

// ---
app.listen(port, () => console.log(`Example app listening on port ${port}!`));