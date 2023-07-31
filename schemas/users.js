NEWSCHEMA('Users', function(schema) {
	schema.define('id', 'number');
	schema.define('email', 'Email', true);
	schema.define('password', 'String(255)');
	schema.define('points', 'number');
	schema.define('status', Boolean)(true);
	schema.define('created', Date);  // assets
	schema.define('updated', Date);
	// Performs login

	schema.setQuery(async function($) {

		// Performs automatically pagination, sort and all checks
		//DBMS().list('pools').autofill($, 'dtcreated:Date,dtupdated:Date', 'id', 'dtcreated_desc', 50).callback($.callback);
		// Or you can use a simple query via:
		var db=DBMS();
		try{
			var res =await db.list('users')
						.autoquery($.query,'id:number,email:string,points:number,status:boolean,created:date,updated:date', 'created_desc')
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
		DBMS().find('users').id($.id).sort('created',false).error(404).callback($.callback);

	});
	schema.setInsert(async function($, model) {

		// Assigns additional values
		//model.id = UID();
		var index =await DBMS().find('users').where('email',model.email).promise();
		if(!index.length){
			//model.id=UID()
			model.updated=new Date();
			model.created = new Date();
			try{
				var setting=await DBMS().insert('users', model).promise();
				$.callback({code:200,data:setting});
			}catch(err){
				$.callback({code:300,message:err.message||'error'});
			}

		}else{
			$.callback({code:500,message:'Email already exists!'});
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
			var data=await DBMS().modify('users', model).where('id',$.id).promise();
			$.callback({code:200,data:data});
		}catch(err){
			$.callback({code:500,message:'Server Error!'});
		}

	});

	schema.setRemove(async function($) {

		// 404 error will be returned if the no records won't be updated
		try{
			var data=await DBMS().remove('users').id($.id).promise();
			$.callback({code:200,data:data});
		}catch(err){
			$.callback({code:500,message:'Server Error!'});
		}
	});

	schema.addWorkflow('login', function($, model) {

		var builder = DBMS().find('users');
		builder.where('email', model.email);
		builder.where('password', model.password);
		builder.first();
		builder.callback(function(err, user) {

			if (!user) {
				return $.invalid(400,'Wrong user name or password!');
			}

			// Creates a cookie and session item
			var token=U.btoa(model.email+':'+model.password)
			//MAIN.session.authcookie($, UID(), token, '3 days');

			// Writes audit
			//$.audit(user.id + ': ' + user.name);
			$.callback({code: 200,data:{token:token}});
		});
	});
	schema.addWorkflow('info', async function($, model) {
		var builder = DBMS().find('users');
		builder.id($.user.id)
		builder.first()
		builder.callback(function(err, user) {
			if(!user){
				$.callback({code: 500,message:"Wrong user name or password!"});
				return;
			}
			$.callback({code: 200,data:{id:user.id,points:user.points,email:user.email,status:user.status}});
		})
			
	})
	// Performs logout
	schema.addWorkflow('logout', function($) {

		// Removes session
		MAIN.session.logout($);

		// Performs a redirect
		$.callback({code: 200,data:null});

	},'email:Email,password:String');

});