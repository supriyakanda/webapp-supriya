var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('pages/home',  { title: 'Express' });
});

/* GET about page. */
router.get('/about', function(req, res) {
  res.render('pages/about');
});

/* GET contact page. */
router.get('/contact', function(req, res) {
  res.render('pages/contact');
});

/* GET projects page. */
router.get('/projects', function(req, res) {
  res.render('pages/projects');
});

/* GET services page. */
router.get('/services', function(req, res) {
  res.render('pages/services');
});

module.exports = router;
