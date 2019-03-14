
const excelin = {
	getExceldata: (xlsxfile,xlsx)=>{
	    return new Promise((resolve,reject)=>{
		        //解析xlsx
		    let obj = xlsx.parse(xlsxfile);
		    resolve(obj);
		});   
	},
	createData: (obj)=>{
		let arr=[];
		obj[0].data.map((item,index)=>{
			if(index != 0){
				arr.push({
					postID:item[0],
					mainPic:item[1],
					marketPrice:item[2],
					discountPrice:item[3],
					goodsName:item[4],
					sku:item[5],
					salenum:item[6],
					kind:item[7],
					comment:item[8]
				})
			}
		})
		return arr;
	}
}

exports.excelin = excelin;