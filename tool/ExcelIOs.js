
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
					id:item[0],
					height:item[1],
					width:item[2],
					img:item[3],
					name:item[4]
				})
			}
		})
		return arr;
	}
}

exports.excelin = excelin;