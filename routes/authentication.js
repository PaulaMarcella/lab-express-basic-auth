'use strict';

const { Router } = require('express');
const router = Router();

const User = require('./../models/user');
const bcrypt = require('bcrypt');


// ____ROUTES______

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  bcrypt.hash(password, 10)
  .then(hash => {
    return User.create({
      username,
      passwordHash: hash
    });
  })
  .then(user => {
  req.session.user = {
    _id: user._id
  };
  console.log('Signed up user', user);
  res.redirect('private');
  
})
.catch(error => {
  console.log('there was an error', error);
  });
});

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password; 
  let userVar;


User.findOne({ username })
  .then(user => {
    if (!user) {
      throw new Error('username not found');
    } else {
      userVar= user;
      return bcrypt.compare(password, user.passwordHash);
    }
    })
  .then(match => {
    if (!match) {
      throw new Error('Wrong password');
    } else {
      req.session.user = {
      _id: userVar._id
      };
      res.redirect('private');
    }
    })
  .catch(error=> {
    console.log('there was an error', error);
    next(error);
  });
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;