const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

// load config
require('dotenv').config({path: './config/config.env'});

// Passport config
require('./config/passport')(passport);

connectDB();

const app = express();

// Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

// Session
app.use(
    session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

//  Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes 
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
