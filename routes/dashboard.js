var express = require('express');
var router = express.Router();
var firebaseAdminDB = require('../connections/firebase_admin');

const categoriesRef = firebaseAdminDB.ref('categories');

/* GET archives page. */
router.get('/archives', function(req, res, next) {
  res.render('dashboard/archives', { title: 'Express' });
});

/* GET article page. */
router.get('/article', function(req, res, next) {
  res.render('dashboard/article', { title: 'Express' });
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
