var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');

router.get('/', function(req, res, next) {
  let { pageCode, pageNumber } = req.query;
	pageCode = pageCode * 1 || 0; // 默认是第一页
	pageNumber = pageNumber * 1 || 30; // 默认每页显示45条数据
	sql.find('products', 'goods', {}).then(data => {
		data = data.splice((pageCode -  1) * pageNumber, pageNumber)
		res.send({
			code: 200,
			message: 'success',
			data: data
		})
	}).catch(err => {
		console.log(err)
	})
});

router.get('/searchK', function(req, res, next) {
	let { goodsName } = req.query;
	  sql.find('products', 'goods', { goodsName: eval('/'+goodsName+'/') }).then(data => {
		  res.send(data).catch(err => {
		  console.log(err)
	  })
  })
});
// http://39.96.196.70:3000/api/product/searchI?postID=532386
router.get('/searchI', function(req, res, next) {
	let { postID } = req.query;
	  sql.find('products', 'goods', { postID: postID*1 }).then(data => {
		  res.send(data).catch(err => {
		  console.log(err)
	  })
  })
});

router.get('/kr', function(req, res, next) {
	let { postID } = req.query;
	  sql.find('products', 'goods', { postID: postID*1 }).then(data => {
		  res.send(data).catch(err => {
		  	console.log(err)
	  	})
  })
});

router.get('/sort', (req, res, next) => {
	let { sortType, num, pageCode, pageNumber } = req.query;
	pageCode = pageCode * 1 || 1; // 默认是第一页
	pageNumber = pageNumber * 1 || 30; // 默认每页显示45条数据
	let sortData = {};
	sortData[sortType] = num * 1;
	sql.sort('products', 'goods', sortData).then(data => {
		data = data.splice((pageCode -  1) * pageNumber, pageNumber)
		res.send(data).catch(err => {
			console.log(err)
		})
	})
})

module.exports = router;
