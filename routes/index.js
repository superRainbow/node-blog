var express = require('express');
var router = express.Router();
var firebaseAdminDB = require('../connections/firebase_admin');

const ref = firebaseAdminDB.ref('any').once('value', (sanpshot)=>{
  console.log('sanpshot', sanpshot.val());
  
});

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET post page. */
router.get('/post', function(req, res, next) {
  res.render('post', { title: 'Express' });
});

/* GET archives page. */
router.get('/dashboard/archives', function(req, res, next) {
  res.render('dashboard/archives', { title: 'Express' });
});

/* GET article page. */
router.get('/dashboard/article', function(req, res, next) {
  res.render('dashboard/article', { title: 'Express' });
});

/* GET categories page. */
router.get('/dashboard/categories', function(req, res, next) {
  res.render('dashboard/categories', { title: 'Express' });
});

/* GET signup page. */
router.get('/dashboard/signup', function(req, res, next) {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
