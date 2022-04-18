const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Product, Tag } = require('../models');
const path = require('path');
const withAuth = require('../utils/auth');
const { log } = require('console');

// Route to Sign-In Page
router.get('/', (req, res) => {
  // If loggedIn, redirect to dashboard
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
  } else {
    res.render('homepage');
  }
});

// Route to registration page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Route to trigger modal for adding Tag
router.get('/add-tag', (req, res) => {
  res.send('This triggers the tag modal');
});

// router.get('/history', (req, res) => {
//   res.send('this triggers the history page');
// });

router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
    monthly_income: req.body.monthly_income
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
