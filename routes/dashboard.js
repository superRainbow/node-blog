var express = require('express');
var striptags = require('striptags');
var moment = require('moment');
const page = require('../views/core-modules/page/page');
var router = express.Router();
var firebaseAdminDB = require('../connections/firebase_admin');

const categoriesRef = firebaseAdminDB.ref('categories');
const articlesRef = firebaseAdminDB.ref('articles');

/* GET archives page. */
router.get('/archives', function(req, res, next) {
  // 用 query來判斷tab 是哪個。ex: ?status=public
  const status = req.query.status || 'public';
  const nowPage = req.query.page || 1;
  let categories = {};
  categoriesRef.once('value').then(sanpshot=>{
    categories = sanpshot.val();
    return articlesRef.orderByChild('articleTime').once('value');
  }).then(sanpshot=>{
    let articles = [];
    sanpshot.forEach((sanpshotChild) => {
      const item = sanpshotChild.val();
      if(item.status === status){
        articles.push(item);
      }
    });
    
    const data = page(articles, nowPage);

    res.render('dashboard/archives', { title: 'Express', categories, articles: data.data, status: status, striptags, moment, page: data.page });
  });
});

/* GET article create page. */
router.get('/article/create', function(req, res, next) {
  categoriesRef.once('value', (sanpshot)=>{
    const categories = sanpshot.val();
    res.render('dashboard/article', { title: 'Express',type: 'create', categories: categories, article: {} });
  });
});

/* POST article create page： add */
router.post('/article/create', function(req, res, next) {
  const data = req.body;
  const article = articlesRef.push();
  data.id = article.key;
  data.articleTime = Math.floor(Date.now()/1000);
  article.set(data).then(()=>{
    res.redirect(`/dashboard/article/${data.id}`);
  })
});

/* GET article 某篇 page. */
router.get('/article/:id', function(req, res, next) {
  const articleID = req.param('id');
  let categories = {};
  categoriesRef.once('value').then(sanpshot=>{
    categories = sanpshot.val();
    return articlesRef.child(articleID).once('value');
  }).then(sanpshot=>{
    articleData = sanpshot.val();
    res.render('dashboard/article', { title: 'Express',type: 'update', categories: categories, article: articleData });
  });
});

/* POST article create page： add */
router.post('/article/update/:id', function(req, res, next) {
  const articleID = req.param('id');
  const data = req.body;
  data.articleTime = Math.floor(Date.now()/1000);
  articlesRef.child(articleID).update(data).then(()=>{
    res.redirect(`/dashboard/article/${articleID}`);
  })
});

/* POST article page： delete */
router.post('/article/delete/:id', function(req, res, next) {
  const articleID = req.param('id');
  articlesRef.child(articleID).remove();
  // res.redirect('/archives');
  // ajax 回傳資訊
  res.send('刪除成功！');
});


/* GET categories page. */
router.get('/categories', function(req, res, next) {
  categoriesRef.once('value', (sanpshot)=>{
    console.log('sanpshot', sanpshot.val());
    const categories = sanpshot.val();
    res.render('dashboard/categories', { 
      title: 'Express',
      categories: categories
     });
  });
});

/* POST categories page： add */
router.post('/categories/create', function(req, res, next) {
  const data = req.body;
  const categoriey = categoriesRef.push();
  data.id = categoriey.key;
  // 新增時，判斷分類路徑是否有重複
  categoriesRef.orderByChild('path').equalTo(data.path).once('value', (sanpshot)=>{
    console.log('sanpshot', sanpshot.val());
    
    if(sanpshot.val()){
      console.log('已有相同路徑！');
      res.redirect('/dashboard/categories');
    }else{
      categoriey.set(data).then(()=>{
        res.redirect('/dashboard/categories');
      })
    }
  });
});

/* POST categories page： delete */
router.post('/categories/delete/:id', function(req, res, next) {
  const categorieyID = req.param('id');
  categoriesRef.child(categorieyID).remove();
  res.redirect('/dashboard/categories');
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
