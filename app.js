// REQUIRE DOTENV CONFIG
require('dotenv/config');

// IMPORTS
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');

// CREATING EXPRESS APP, SETTING PORT
const app = express();
const PORT = process.env.PORT || 3000;
// MIDDLEWARE FOR JSON PARSE
app.use(express.json());


app.use(express.static('public'));

// TEMPLATING ENGINE
app.use(expressLayout);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');

// ROUTES
const mainRoute = require('./server/routes/main'); // IMPORT MAIN ROUTE
app.use('/', mainRoute);

const projectsRoute = require('./server/routes/projects'); // IMPORT PROJECTS ROUTE
app.use('/api', projectsRoute);


// CONNECT TO DATABASE
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Connected to Database');
  })
  .catch(err => {
    console.log('Message: ', err); // CONSOLE LOG MESSAGE FOR ERROR HANDLING
  });



// LISTEN SERVER AT PORT 3000
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});