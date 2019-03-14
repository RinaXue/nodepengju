var express = require('express');
var router = express.Router();
const sql = require('../tool/sql')
const xlsx = require('node-xlsx')
const nodeExcel = require('excel-export');
// const xlsxfile = "E:/第三阶段/myday05/myapp/shopAds.xlsx";
const xlsxfile = "/usr/local/node-pro/myapp/shopAds.xlsx";
const ExcelIO = require('../tool/ExcelIOs') 
/* GET home page. */
router.get('/', function(req, res, next) {
	if (!req.cookies.isLogin || req.cookies.isLogin == 0) { // 表示未登录
    res.redirect('/login'); // 跳转到登录页面
    return; // 代码将不再继续往下执行
  }
	let { pageCode,pageNumber } = req.query
	pageCode = pageCode*1 || 1;
	pageNumber = pageNumber*1 || 6;
 	sql.find('shopAds','swipers',{}).then((data) =>{
		let totalNumber = Math.ceil(data.length/pageNumber)
		data = data.splice((pageCode - 1) *pageNumber, pageNumber)
		sql.distinct('shopAds', 'swipers', 'width').then(widthArr => {
			res.render('cart', {
			  	activeIndex:4,
		  		data,
		  		totalNumber,
		  		pageCode,
		  		pageNumber,
		  		type:1,
		  		widthArr
		 	});
		})
	}).catch((err)=>{
		console.log(err)
	})
})

router.get('/remove', function(req, res, next) {
	const { pageCode,pageNumber } = req.query;
	const id  = req.query.id*1;
	sql.remove('shopAds','swipers',{ id:id }).then(() =>{
		res.redirect('/cart?pageCode='+pageCode+'&pageNumber='+pageNumber);
	}).catch((err) =>{
		console.log(err)
		res.redirect('/cart');
	})
})

router.get('/allremove', function(req, res, next) {
	sql.remove('shopAds','swipers',{ }).then(() =>{
		res.redirect('/cart');
	}).catch((err) =>{
		console.log(err)
		res.redirect('/cart');
	})
})

router.get('/add', function(req, res, next) {
	let { totalNumber,pageNumber } = req.query;
	sql.distinct('shopAds', 'swipers', 'width').then(widthArr => {
		res.render('cart_add',{
			activeIndex:4,
			totalNumber,
			pageNumber,
			widthArr
		});
	})
})

router.post('/addAction', function(req, res, next) {
	const { id,width,height,img,name,totalNumber,pageNumber } = req.body;
	sql.insert('shopAds','swipers',{ "id":id*1,width,height,img,name }).then(() =>{
		res.redirect('/cart?pageCode='+totalNumber+'&pageNumber='+pageNumber);
	}).catch((err) =>{
		res.redirect('/cart');
	})
})


router.post('/updateAction', function(req, res, next) {
	const pageCode = req.body.pageCode
	const pageNumber = req.body.pageNumber
	const id  = req.body.id*1;
	const name  = req.body.name;
	sql.update('shopAds','swipers','updateOne',{ id },{$set:{ name }}).then(() =>{
		res.redirect('/cart?pageCode='+pageCode+'&pageNumber='+pageNumber);
	}).catch((err) =>{
		res.redirect('/cart');
	})
})

router.get('/importexcelxlsx',function(req, res, next) {
	ExcelIO.excelin.getExceldata(xlsxfile,xlsx).then((obj)=>{
		let arr = ExcelIO.excelin.createData(obj);
		sql.insert('shopAds','swipers',arr).then(()=>{
			res.redirect('/cart');
		})	
	})
})

router.get('/exportexcel',function(req, res, next) {
	var conf={};
	sql.find('shopAds','swipers',{}).then((data)=>{
		let alldata = new Array();
		data.map((item,index)=>{
			let arr = [];
			arr.push(item.id)
			arr.push(item.height)
			arr.push(item.width)
			arr.push(item.img)
			arr.push(item.name)
			alldata.push(arr);
		})
		conf.name='mysheet';
		conf.cols=[
			{caption:'id',type:'number'},
			{caption:'height',type:'number'},
			{caption:'width',type:'number'},
			{caption:'img',type:'string'},
			{caption:'name',type:'string'},
		]
		conf.rows=alldata;
		console.log(conf)
		var result = nodeExcel.execute(conf);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		res.setHeader("Content-Disposition", "attachment; filename=" + "test.xlsx");
		res.end(result, 'binary');
	})

})

router.get('/search',function(req, res, next) {
	let { name,pageCode,pageNumber } = req.query;
	let type = 'search';
	sql.find('shopAds','swipers',{	name: eval('/'+name+'/') }).then((data) =>{
		let totalNumber = Math.ceil(data.length / pageNumber)
		if(totalNumber < pageCode){
			pageCode=1;
		}
		pageCode = pageCode*1
		data = data.splice((pageCode - 1) *pageNumber, pageNumber)
		sql.distinct('shopAds', 'swipers', 'width').then(widthArr => {
			res.render('cart',{
				activeIndex:4,
				data,
				totalNumber,
				pageCode,
				pageNumber,
				type,
				name,
				widthArr				
			});
		})
	}).catch((err) =>{
		console.log(err)
	})
})

router.get('/widthSearch',function(req, res, next) {
	let { width } = req.query;
	let type = 1;
	sql.find('shopAds','swipers',{ width:width*1 }).then((data) =>{
		sql.distinct('shopAds', 'swipers', 'width').then(widthArr => {
			res.render('cart',{
				activeIndex:4,
				totalNumber:1,
				pageCode:1,
				data,
				type,
				pageNumber:data.length,
				widthArr
			});
		})	
	}).catch((err) =>{
		console.log(err)
	})
})

router.get('/sort', (req, res, next) => {
	let { sortType, num } = req.query;
	let type=1;
	let sortData = {};
	sortData[sortType] = num * 1;
	sql.sort('shopAds', 'swipers', sortData).then(data => {
		sql.distinct('shopAds', 'swipers', 'width').then(widthArr => {
			res.render('cart', {
				activeIndex: 4,
				totalNumber: 1,
				pageCode: 1,
				data,
				type,
				pageNumber: data.length,
				widthArr
			})
		})
		
	})
})


module.exports = router;
