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


module.exports = router;
