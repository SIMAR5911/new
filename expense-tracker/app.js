const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
console.log(process.env.MONGODB_URI);  // Check if the URI is logged correctly

const mongoose = require('mongoose');

// Import Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const expensesRouter = require('./routes/expenses');

// Init app
const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.log("MongoDB connection error: ", err);
  });


// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session & Passport Setup
app.use(session({
  secret: process.env.SESSION_SECRET, // Use secret from .env
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/expenses', expensesRouter);

module.exports = app; // ✅ VERY IMPORTANT
