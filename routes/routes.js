var express = require('express');
// var router = express.Router();
var dbConnection = require('../database');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

module.exports = function (router) {



  router.get('/', (req, res) => {
    res.redirect('/home');
  });

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
    if (!req.session.isLoggedIn) {
      return res.render('pages/login');
    }
    next();
  }

  const ifLoggedin = (req, res, next) => {
    if (req.session.isLoggedIn) {
      return res.redirect('/secure/business_contacts/list');
    }
    next();
  }
  // END OF CUSTOM MIDDLEWARE

  function compare(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  /* GET services page. */
  router.get('/secure/business_contacts/list', ifNotLoggedin, function (req, res) {
    dbConnection.execute("SELECT * FROM `bussiness_contacts`")
      .then(([rows]) => {
        res.render('pages/secured/business_contacts.ejs', {
          title: 'All contacts',
          data: rows.sort(compare)
        });
      });
  });

  /* Edit services page. */
  router.get('/secure/business_contacts/edit/(:id)', ifNotLoggedin, function (req, res) {
    dbConnection.execute('SELECT * FROM bussiness_contacts WHERE id = ' + req.params.id)
      .then(([rows]) => {
        res.render('pages/secured/business_contacts_edit', {
          title: 'Edit Country',
          id: rows[0].id,
          name: rows[0].name,
          email: rows[0].email,
          contact_number: rows[0].contact_number
        });
      });
  });

  /* Edit services page. */
  router.post('/secure/business_contacts/edit/(:id)', ifNotLoggedin, function (req, res) {
    dbConnection.execute('UPDATE `bussiness_contacts` SET `name`=?,`email`=?,`contact_number`=? where `id`=?', [req.body.name, req.body.email, req.body.contact_number, req.params.id])
      .then(([rows]) => {
        return res.redirect('/secure/business_contacts/list');
      });
  });

  /* DELETE services page. */
  router.post('/secure/business_contacts/delete/(:id)', ifNotLoggedin, function (req, res) {
    dbConnection.execute('DELETE FROM bussiness_contacts WHERE id = ' + req.params.id, [req.params.id])
      .then(([rows]) => {
        console.log('deletee', rows)
        return res.redirect('/secure/business_contacts/list');
      });
  });


  // ROOT PAGE
  router.get('/secure/*', ifNotLoggedin, (req, res, next) => {
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?", [req.session.userID])
      .then(([rows]) => {
        res.render('/secure/business_contacts', {
          name: rows[0].name
        });
      });
  });
  // END OF ROOT PAGE

  router.get('/login', ifLoggedin, function (req, res) {
    res.render('pages/login', { message: 'loginMessage' });
  });

  // LOGIN PAGE
  router.post('/login', [ // validation
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
              res.redirect('/secure/business_contacts/list');
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
  router.get('/logout', (req, res) => {
    //session destroy

    req.session = null;
    console.log('hi', req.session);
    res.redirect('/login');
  });
  // END OF LOGOUT

  // router.use('/secure', (req, res) => {
  //   res.status(404).send('<h1>404 Page Not Found!</h1>');
  // });


}




// module.exports = router;
