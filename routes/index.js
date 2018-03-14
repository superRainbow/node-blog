var express = require('express');
var striptags = require('striptags');
var moment = require('moment');
var router = express.Router();

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
    let data = [];
    sanpshot.forEach((sanpshotChild) => {
      const item = sanpshotChild.val();
      if(item.status === 'public'){
        articles.push(item);
      }
    });

    // 分頁
    const totalArticles = articles.length;
    const pageSize = 2;
    const totalPages = Math.ceil(totalArticles / pageSize);
    if(nowPage > totalPages){
      nowPage = totalPages;
    }

    const startItem = (nowPage * pageSize) - pageSize +1;
    const endItem = nowPage * pageSize;
    articles.forEach((item, i)=>{
      const nowItem = i + 1;
      if(nowItem >= startItem && nowItem <= endItem){
        data.push(item);
      }
    });

    const page = {
      totalPages,
      nowPage,
      hasPre: nowPage >1,
      hasNext: nowPage < totalPages
    };
    res.render('index', { title: 'Express', categories, articles: data, page, striptags, moment });
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
