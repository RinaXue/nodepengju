
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
					tel:item[0],
					nickname:item[1],
					password:item[2],
					age:item[3]
				})
			}
		})
		return arr;
	}
}

exports.excelin = excelin;