// ================================================
// AUTHORIZATION
// Please note that this method is called for all routes, regardless of flags set.
// For example, if the route is flagged with 'authorize', and the callback return value is false, the response status will be 401.
// Alternatively, beware that if the route is flagged with 'unauthorize', and the callback return value is false, the response status will be 200 OK.
// ================================================


// var opt = {};

// // A secret key
// opt.secret = CONF.cookie_secret;

// // A cookie name (optional)
// opt.cookie = CONF.cookie;


// opt.expire = '24 hours';


// opt.onsession = function(session, $, init){

// }


// opt.onread = function(meta, next) {

// 	// meta.sessionid {String}
// 	// meta.userid {String}
// 	// meta.ua {String} A user-agent
// 	// next(err, USER_DATA) {Function} A callback function
// 	var auth=U.atob(meta.userid)
// 	var a=auth.split(':')
// 	DBMS().find('users').where('email',a[0]).where('password',a[1]).first().callback(next);
// };

// // Release delegate
// opt.onfree = function(meta) {
// 	// meta.sessions {Array String} with sessionid
// 	// meta.users {Array String} with userid (can be "null")
// 	//console.log(meta)
// };

// AUTH(opt);

// MAIN.session = opt;

AUTH(function($){
	var auth_str=$.req.headers['authorization']||null
    if (!auth_str) {
		return $.invalid();
    }
	var token=auth_str.split(' ')
	var auth=U.atob(token[1])
	var a=auth.split(':')
	var builder = DBMS().find('users');
	builder.where('email', a[0]);
	builder.where('password', a[1]);
	builder.first();
	builder.callback(function(err, user) {
		if(err||!user){
			return $.invalid();
		}
		$.user=user;
		return $.success(user);
	})
	
})