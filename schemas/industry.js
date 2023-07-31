NEWSCHEMA('Industry', function(schema) {
	schema.define('id', 'number');
	schema.define('CSRC_CODE', 'String(50)');
	schema.define('CSRC_NAME', 'String(100)');
	schema.define('created', Date);  // assets
	schema.define('updated', Date);
	// Performs login

	schema.setQuery(async function($) {

		// Performs automatically pagination, sort and all checks
		//DBMS().list('pools').autofill($, 'dtcreated:Date,dtupdated:Date', 'id', 'dtcreated_desc', 50).callback($.callback);
		// Or you can use a simple query via:
		var db=DBMS();
		try{
			var res =await db.list('industry')
						.autoquery($.query,'id:number,CSRC_CODE:string,CSRC_NAME:string,status:boolean,created:date,updated:date', 'created_desc')
						.page(Number($.query.page)||1, Number($.query.limit)||20)
						.promise();
			$.callback({code:200,data:{items:res.items,total:res.count,page:res.page}});
		}catch(err){
			$.callback({code:300,message:err.message||'error'});
		}

	});

	schema.setRead(function($) {

		// Performs query
		// 404 error will be returned if the no records won't be updated
		DBMS().find('industry').id($.id).sort('created',false).error(404).callback($.callback);

	});
	schema.setInsert(async function($, model) {

		// Assigns additional values
		model.id = UID();

        model.updated=new Date();
        model.created = new Date();
        console.log(model)
        try{
            var setting=await DBMS().insert('industry', model).promise();
            $.callback({code:200,data:setting});
        }catch(err){
            $.callback({code:300,message:err.message||'error'});
        }


	});

	schema.setUpdate(async function($, model) {

		// Assigns additional values
		model.updated = new Date();
		delete model.created
		delete model.password
		// Performs query
		// 404 error will be returned if the no records won't be updated
		try{
			var data=await DBMS().modify('industry', model).where('id',$.id).promise();
			$.callback({code:200,data:data});
		}catch(err){
			$.callback({code:500,message:'Server Error!'});
		}

	});

	schema.setRemove(async function($) {

		// 404 error will be returned if the no records won't be updated
		try{
			var data=await DBMS().remove('industry').id($.id).promise();
			$.callback({code:200,data:data});
		}catch(err){
			$.callback({code:500,message:'Server Error!'});
		}
	});


});