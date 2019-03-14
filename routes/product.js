var express = require('express');
var router = express.Router();
const sql = require('../tool/sql')
const xlsx = require('node-xlsx')
const nodeExcel = require('excel-export');
const xlsxfile = "E:/第三阶段/myday05/myapp/product.xlsx";
// const xlsxfile = "/usr/local/node-pro/myapp1/product.xlsx";
const ExcelIO = require('../tool/ExcelIOp') 
/* GET home page. */
router.get('/', function(req, res, next) {
	if (!req.cookies.isLogin || req.cookies.isLogin == 0) { // 表示未登录
    res.redirect('/login'); // 跳转到登录页面
    return; // 代码将不再继续往下执行
  }
	let { pageCode,pageNumber } = req.query
	pageCode = pageCode*1 || 0;
	pageNumber = pageNumber*1 || 30;
 	sql.find('products','goods',{}).then((data) =>{
		let totalNumber = Math.ceil(data.length/pageNumber)
		data = data.splice((pageCode - 1) *pageNumber, pageNumber)
		sql.distinct('products', 'goods', 'goodsName').then(goodsNameArr => {
		
			res.render('product', {
			  	activeIndex:3,
		  		data,
		  		totalNumber,
		  		pageCode,
		  		pageNumber,
		  		type:1,
		  		goodsNameArr
		 	});
		})
	}).catch((err)=>{
		console.log(err)
	})
})

router.get('/remove', function(req, res, next) {
	const { pageCode,pageNumber } = req.query;
	pageCode = pageCode*1 || 0;
	pageNumber = pageNumber*1 || 30;
	const postID  = (req.query.postID)*1;
	sql.remove('products','goods',{ postID:postID }).then(() =>{
		res.redirect('/product?pageCode='+pageCode+'&pageNumber='+pageNumber);
	}).catch((err) =>{
		console.log(err)
		res.redirect('/product');
	})
})

router.get('/allremove', function(req, res, next) {
	sql.remove('products','goods',{ }).then(() =>{
		res.redirect('/product');
	}).catch((err) =>{
		console.log(err)
		res.redirect('/product');
	})
})

router.get('/add', function(req, res, next) {
	let { totalNumber, pageNumber } = req.query;

	sql.distinct('products', 'goods', 'goodsName').then(goodsNameArr => {
		res.render('product_add',{
			activeIndex:3,
			totalNumber,
			pageNumber,
			goodsNameArr
		});
	})
})

router.post('/addAction', function(req, res, next) {
	const { postID,marketPrice,discountPrice,goodsName,sku,mainPic,totalNumber,pageNumber } = req.body;
	sql.insert('products','goods',{ "postID":postID*1,marketPrice,discountPrice,goodsName,discountPrice:discountPrice*1,mainPic,sku }).then(() =>{
		res.redirect('/product?pageCode='+totalNumber+'&pageNumber='+pageNumber);
	}).catch((err) =>{
		res.redirect('/product');
	})
})

router.post('/updateAction', function(req, res, next) {
	const pageCode = req.body.pageCode
	const pageNumber = req.body.pageNumber
	const postID  = req.body.postID;
	const goodsName  = req.body.goodsName;
	const sku  = req.body.sku;
	const marketPrice = (req.body.marketPrice)*1;
	const salenum = (req.body.salenum)*1;
	const kind = (req.body.kind)*1;
	const comment = req.body.comment;
	sql.update('products','goods','updateOne',{ postID },{$set:{ goodsName,marketPrice,sku,kind,salenum,comment }}).then(() =>{
		res.redirect('/product?pageCode='+pageCode+'&pageNumber='+pageNumber);
	}).catch((err) =>{
		res.redirect('/product');
	})
})

router.get('/importexcelxlsx',function(req, res, next) {
	ExcelIO.excelin.getExceldata(xlsxfile,xlsx).then((obj)=>{
		console.log(obj[0])
		let arr = ExcelIO.excelin.createData(obj);
		sql.insert('products','goods',arr).then(()=>{
			res.redirect('/product');
		})	
	})
})

router.get('/exportexcel',function(req, res, next) {
	var conf={};
	sql.find('products','goods',{}).then((data)=>{
		let alldata = new Array();
		data.map((item,index)=>{
			let arr = [];
			arr.push(item.postID)
			arr.push(item.mainPic)
			arr.push(item.marketPrice)
			arr.push(item.discountPrice)
			arr.push(item.goodsName)
			arr.push(item.sku)
			arr.push(item.salenum)
			arr.push(item.kind)
			arr.push(item.comment)
			alldata.push(arr);
		})
		conf.name='mysheet';
		conf.cols=[
			{caption:'postID',type:'number'},
			{caption:'mainPic',type:'string'},
			{caption:'marketPrice',type:'number'},
			{caption:'discountPrice',type:'number'},
			{caption:'goodsName',type:'string'},
			{caption:'sku',type:'string'},
			{caption:'salenum', type:'number'},
			{caption:'kind', type:'number'},
			{caption:'comment',type:'string'}
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
	let { goodsName,pageCode,pageNumber } = req.query;

	let type = 'search';
	sql.find('products','goods',{	goodsName: eval('/'+goodsName+'/') }).then((data) =>{
		let totalNumber = Math.ceil(data.length / pageNumber)
		if(totalNumber < pageCode){
			pageCode=1;
		}
		pageCode = pageCode*1
		data = data.splice((pageCode - 1) *pageNumber, pageNumber)
		sql.distinct('products', 'goods', 'goodsName').then(goodsNameArr => {
			res.render('product',{
				activeIndex:3,
				data,
				totalNumber,
				pageCode,
				pageNumber,
				type,
				productName,
				goodsNameArr				
			});
		})
	}).catch((err) =>{
		console.log(err)
	})
})

router.get('/goodsNameSearch',function(req, res, next) {
	let { goodsName } = req.query;
	let type = 1;
	sql.find('products','goods',{ goodsName }).then((data) =>{
		sql.distinct('products', 'goods', 'goodsName').then(goodsNameArr => {
			res.render('product',{
				activeIndex:3,
				totalNumber:1,
				pageCode:1,
				data,
				type,
				pageNumber:data.length,
				goodsNameArr
			});
		})	
	}).catch((err) =>{
		console.log(err)
	})
})

router.get('/sort', (req, res, next) => {
	let { sortType, num, pageCode, pageNumber } = req.query;
	pageCode = pageCode*1 || 0;
	pageNumber = pageNumber*1 || 30;
	let type=1;
	let sortData = {};
	sortData[sortType] = num * 1;
	data = data.splice((pageCode - 1) *pageNumber, pageNumber)
	sql.sort('products', 'goods', sortData).then(data => {
		sql.distinct('products', 'goods', 'goodsName').then(goodsNameArr => {
			res.render('product', {
				activeIndex: 3,
				totalNumber: 1,
				pageCode: 1,
				data,
				type,
				pageNumber: data.length,
				goodsNameArr
			})
		})
	})
})

module.exports = router;
