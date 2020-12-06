const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');
const subdomain = require('express-subdomain');

// load config
require('dotenv').config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

connectDB();

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      
        // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
}))
// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');


// Handlebars
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        truncate,
        stripTags,
        editIcon,
        select
    }, extname: '.hbs', defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

// Session
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    }));

//  Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use((request, response, next) => {
    response.locals.user = request.user || null;
    response.locals.DOMAIN = process.env.DOMAIN;
    next();
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes 
app.use(subdomain('learn', require('./routes/subdomain/learn')));
app.use(subdomain('store', require('./routes/subdomain/store')));
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
