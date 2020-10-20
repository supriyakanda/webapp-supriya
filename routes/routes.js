

/**
 * 
 * 
 * 
 * For Crypting the password : https://www.browserling.com/tools/bcrypt
 */



var express = require('express');
var router = express.Router();
var dbConnection = require('../database');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');




// router.use('/', (req, res) => {
//   res.redirect('/home');
// });

/* GET home page. */
router.get('/home', function (req, res) {
  res.render('pages/home', { title: 'Express' });
});

/* GET about page. */
router.get('/about', function (req, res) {
  res.render('pages/about');
});

/* GET contact page. */
router.get('/contact', function (req, res) {
  res.render('pages/contact');
});

/* GET projects page. */
router.get('/projects', function (req, res) {
  res.render('pages/projects');
});

/* GET services page. */
router.get('/services', function (req, res) {
  res.render('pages/services');
});


// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
  console.log(req.session);
  if (!req.session.isLoggedIn) {
    return res.render('pages/login');
  }
  next();
}

const ifLoggedin = (req, res, next) => {
  if (req.session.isLoggedIn) {
    // return res.redirect('/home');
    return res.redirect('/secure/business_contacts');
  }
  next();
};

// router.use('/secure', (req, res) => {
//   res.redirect('/secure/login');
// });

// ROOT PAGE
router.get('/secure', ifNotLoggedin, (req, res, next) => {
  dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?", [req.session.userID])
    .then(([rows]) => {
      res.render('pages/login', {
        name: rows[0].name
      });
    });

});// END OF ROOT PAGE



// LOGIN PAGE
router.post('/secure', ifLoggedin, [
  body('user_email').custom((value) => {
    return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
      .then(([rows]) => {
        if (rows.length == 1) {
          return true;
        }
        return Promise.reject('Invalid Email Address!');
      });
  }),
  body('user_pass', 'Password is empty!').trim().not().isEmpty(),
], (req, res) => {
  const validation_result = validationResult(req);
  const { user_pass, user_email } = req.body;
  if (validation_result.isEmpty()) {

    dbConnection.execute("SELECT * FROM `users` WHERE `email`=?", [user_email])
      .then(([rows]) => {
        // console.log(rows[0].password);
        bcrypt.compare(user_pass, rows[0].password).then(compare_result => {
          if (compare_result === true) {
            
            req.session.isLoggedIn = true;
            req.session.userID = rows[0].id;

            res.redirect('/secure/business_contacts');
          }
          else {
            res.render('pages/login', {
              login_errors: ['Invalid Password!']
            });
          }
        })
          .catch(err => {
            if (err) throw err;
          });


      }).catch(err => {
        if (err) throw err;
      });
  }
  else {
    let allErrors = validation_result.errors.map((error) => {
      return error.msg;
    });
    // REDERING login PAGE WITH LOGIN VALIDATION ERRORS
    res.render('pages/login', {
      login_errors: allErrors
    });
  }
});
// END OF LOGIN PAGE

// LOGOUT
router.get('/secure/logout', (req, res) => {
  //session destroy
  req.session = null;
  res.redirect('/');
});
// END OF LOGOUT

// router.use('/secure', (req, res) => {
//   res.status(404).send('<h1>404 Page Not Found!</h1>');
// });


/* GET services page. */
router.get('/secure/business_contacts', function (req, res) {
  res.render('pages/secured/business_contacts');
});


module.exports = router;
