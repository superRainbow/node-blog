var express = require('express');
var striptags = require('striptags');
var moment = require('moment');
var router = express.Router();
const page = require('../views/core-modules/page/page');
var firebaseAdminDB = require('../connections/firebase_admin');
const categoriesRef = firebaseAdminDB.ref('categories');
const articlesRef = firebaseAdminDB.ref('articles');

/* GET index page. */
router.get('/', function(req, res, next) {
  const nowPage = req.query.page || 1;
  let categories = {};
  categoriesRef.once('value').then(sanpshot=>{
    categories = sanpshot.val();
    return articlesRef.orderByChild('articleTime').once('value');
  }).then(sanpshot=>{
    let articles = [];
    sanpshot.forEach((sanpshotChild) => {
      const item = sanpshotChild.val();
      if(item.status === 'public'){
        articles.push(item);
      }
    });

    const data = page(articles, nowPage);
    
    res.render('index', { title: 'Express', categories, articles: data.data, page: data.page, striptags, moment });
  });
});

/* GET post page. */
router.get('/post/:id', function(req, res, next) {
  const articleID = req.param('id');
  let categories = {};
  categoriesRef.once('value').then(sanpshot=>{
    categories = sanpshot.val();
    return articlesRef.child(articleID).once('value');
  }).then(sanpshot=>{
    articleData = sanpshot.val();
    res.render('post', { title: 'Express',type: 'update', categories: categories, article: articleData, moment });
  });
});


module.exports = router;
