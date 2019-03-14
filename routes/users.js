var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var md5 = require('md5');
// var xlsx = require('node-xlsx');
var filemd = require('./../tool/file.js');

/* GET users listing. */
// router.get('/', function(req, res, next) {
// 	sql.find('sh1811', 'users', {}).then(data => {
// 		res.render('users', { 
// 			activeIndex: 2,
// 			data    //  < == > data: data
// 		});
// 	}).catch(err => {
// 		console.log(err)
// 	})
// });
router.get('/', function(req, res, next) {
	let { pageCode, pageNumber } = req.query;
	pageCode = pageCode * 1 || 1; // 默认是第一页
	pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
	sql.find('jingjing', 'users', {}).then(data => {
		const totalNumber = Math.ceil(data.length / pageNumber);
		data = data.splice((pageCode -  1) * pageNumber, pageNumber)
		sql.distinct('jingjing', 'users', 'age').then(ageArr => {
			res.render('users', { 
				activeIndex: 2,
				totalNumber,
				pageNumber,
				pageCode,
				data, 
				ageArr
			});
		})
		
	}).catch(err => {
		console.log(err)
	})
});
router.get('/add', function(req, res, next) {
  res.render('users_add', { 
		activeIndex: 2
	});
});
router.post('/addAction', function(req, res, next) {
	// { tel: tel}    { tel }
 // post 如何拿数据
 // const obj = req.body;
 let { tel, nickname, password, age } = req.body;
 tel *= 1;
 age *= 1;
 sql.find('jingjing', 'users', { tel: tel }).then(data => {
	if (data.length == 0) {
		// 表示没有查询到数据 --- 可以添加该用户 -- 先加密  -- 后添加
		password = md5(password);
		sql.insert('jingjing', 'users', { tel, nickname, password, age })
			.then(() => {
				res.redirect('/users');
			})
			.catch((err) => {
				res.redirect('/users/add');
			})
	} else {
		// 该用户已存在
		res.redirect('/users/add');
	}
 }).catch(err => {
	 console.log(err)
	 res.redirect('/users/add');
 })
 // console.log(obj);
 
});
// 删除
router.get('/remove', function(req, res, next) {
	const { tel } = req.query;
  sql.remove('jingjing', 'users', { tel:tel*1 }).then(() => {
	  res.redirect('/users');
  }).catch((err) => {
	  res.redirect('/users');
  })
});
//全部删除
router.get('/allremove', function(req, res, next) {
  sql.remove('jingjing', 'users', {}).then(() => {
	  res.redirect('/users');
  }).catch((err) => {
	  res.redirect('/users');
  })
});

// 更新
router.post('/updateAction', function(req, res, next) {
	let { tel, nickname, pageCode } = req.body;
	tel = tel * 1;
  sql.update('jingjing', 'users', 'updateOne', { tel }, {$set: { nickname }})
  .then(() => {
	  res.redirect('/users?pageCode=' + pageCode);
  }).catch(err => {
	  res.redirect('/users');
  })
});

const usersxlsx = "E:/第三阶段/myday05/myapp/stu.xlsx";
// function analysisdata () {
// 	return new Promise((resolve, reject) => {
// 		// 解析excel文件
// 		const obj = xlsx.parse(usersxlsx);
// 		resolve(obj); // obj为buffer类型
// 	})
// }
// function filterdata (data) {
// 	let arr = [];
// 	data.map((item, index) => {
// 		if(index !== 0) {
// 			arr.push({
// 				tel: item[0],
// 				nickname: item[1],
// 				password: item[2]
// 			})
// 		}
// 	})
// 	return arr;
// }
router.get('/importUsers', (req, res, next) => {
	filemd.analysisdata(usersxlsx).then(obj => {
		console.log(obj)
		const data = obj[0].data;
		const result = filemd.usersfilterdata(data)
		// res.send(result)
		sql.insert('jingjing', 'users', result).then(() => {
			res.redirect('/users')
		})
	})
})
// 导出
router.get('/exportUsers', (req, res, next) => {
	const _headers =  [
		{caption:'tel',type:'string'},
		{caption:'nickname',type:'string'},
		{caption:'password',type:'string'},
		{caption:'age',type:'number'}];


	sql.find('jingjing', 'users', {}).then(data => {
		let alldata = new Array();
    data.map((item, index) => {
      let arr = [];
      arr.push(item.tel);
      arr.push(item.nickname);
			arr.push(item.password);
			arr.push(item.age);
      alldata.push(arr);
		})
		const result = filemd.exportdata(_headers, alldata);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		res.setHeader("Content-Disposition", "attachment; filename=" + "test.xlsx");
		res.end(result, 'binary');
	})
})

router.get('/search', (req, res, next) => {
	const { nickname } = req.query;
	sql.find('jingjing', 'users', { nickname: eval('/'+nickname+'/') }).then(data => {
		// res.send(data)
		sql.distinct('jingjing', 'users', 'age').then(ageArr => {
			res.render('users', {
				activeIndex: 2,
				totalNumber: 1,
				pageCode: 1,
				data,
				pageNumber: data.length,
				ageArr
			})
		})
		
	})
})

router.get('/ageSearch', (req, res, next) => {
	let { age } = req.query;
	age *= 1;
	sql.find('jingjing', 'users', { age }).then(data => {
		// res.send(data)
		sql.distinct('jingjing', 'users', 'age').then(ageArr => {
			res.render('users', {
				activeIndex: 2,
				totalNumber: 1,
				pageCode: 1,
				data,
				pageNumber: data.length,
				ageArr
			})
		})
		
	})
})

router.get('/sort', (req, res, next) => {
	let { type, num } = req.query;
	let sortData = {};
	sortData[type] = num * 1;
	sql.sort('jingjing', 'users', sortData).then(data => {
		// res.send(data)
		sql.distinct('jingjing', 'users', 'age').then(ageArr => {
			res.render('users', {
				activeIndex: 2,
				totalNumber: 1,
				pageCode: 1,
				data,
				pageNumber: data.length,
				ageArr
			})
		})
		
	})
})

router.get('/distinct', (req, res, next) => {
	sql.distinct('jingjing', 'users', 'age').then(ageArr => {
		res.send(ageArr)
	})
})
module.exports = router;
