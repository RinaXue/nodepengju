var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var md5 = require('md5');

//分页功能，要添加在最开始
router.get('/', function(req, res, next) {
  router.get('/', function(req, res, next) {
  let { pageCode, pageNumber } = req.query
  pageCode = pageCode * 1 || 1;  //默认是第一页
  pageNumber = pageNumber * 1 || 40; 
  sql.find('sh1811', 'users', {}).then(data => {
    data = data.splice((pageCode - 1) * pageNumber, pageNumber)
    res.send({
			code: 200,
			message: 'success',
			data: data
		})
  }).catch(err => {
    console.log(err)
  })  
})
});

//添加用户里的表单
router.post('/addAction', function(req, res, next) {
  // const obj = req.body;
  let { tel, nickname, password, age, totalNumber } = req.body;
  tel *= 1;
  age *= 1;
  sql.find('sh1811', 'users', { tel: tel }).then(data => {
      password = md5(password);      
      sql.insert('sh1811', 'users', { tel, nickname, password, age, totalNumber }).then(() => {
        res.send({
          code: 200,
          message: 'success',
          data: 1
        }).catch(err => {
          res.send({
            code: 200,
            message: 'success',
            data: 0
      })
    }).catch(err => {
      res.send({
        code: 200,
        message: 'success',
        data: -1
      })
    })
  })
})
});

//删除
router.get('/remove', function(req, res, next) {
  let { tel } = req.query;
  sql.remove('sh1811', 'users', { 'tel': tel*1 }).then(() => {
    res.send({
      code: 200,
      message: 'success',
      data: 1
    })
  }).catch(err => {
    res.send({
      code: 200,
      message: 'success',
      data: 0
    })
  })
});
//更新
router.post('/updateAction', function(req, res, next) {
  let { tel, nickname } = req.body;
  sql.update('sh1811', 'users', 'updateOne', { 'tel': tel*1 }, {$set: { nickname }}).then(() => { 
    res.send({
      code: 200,
      message: 'success',
      data: 1
    }).catch(err => {
      res.send({
        code: 200,
        message: 'success',
        data: 0
      })
    }) 
  })
});

//搜索功能
router.get('/search', (req, res, next) => {
  const { nickname } = req.query;
  sql.find('sh1811', 'users', { nickname: eval('/' + nickname + '/')}).then(data => {
    // res.send(data);
    sql.distinct('sh1811', 'users', 'age').then(ageArr => {
      res.send({
        code: 200,
        message: 'success',
        data: data
      })
    })
  })
});

//年龄分类功能
router.get('/ageSearch', (req, res, next) => {
  let { age } = req.query;
  age *= 1;
  sql.find('sh1811', 'users', { age }).then(data => {
    // res.send(data);
    sql.distinct('sh1811', 'users', 'age').then(ageArr => {
      res.send({
        code: 200,
        message: 'success',
        data: data
      })
    })
  })
});

//升序和降序分类
router.get('/sort', (req, res, next) => {
  let { type, num } = req.query;
  let sortData = {};
  sortData[type] = num * 1;
  sql.sort('sh1811', 'users', sortData).then(data => {
    sql.distinct('sh1811', 'users', 'age').then(ageArr => {
      res.send({
        code: 200,
        message: 'success',
        data: data
      })
    })
  })
});

router.get('/sendCode', (req, res, next) => {
	let { tel } = req.query;
	sendCode({
		phoneNum: tel,
		code:'3456',
		success:function(data){
			if(data == "ok"){
				res.send("1")
			}
		}
	})
})

module.exports = router;