exports.install = function() {
	ROUTE('+GET   /api/users/        *Users --> query');
	ROUTE('POST   /api/user        *Users --> insert');
	ROUTE('+DELETE   /api/user/{id}        *Users --> remove');
	ROUTE('+PUT   /api/user/{id}        *Users --> update');

	// ROUTE('+GET /api/user/info         *Users --> @info');
	// ROUTE('POST /api/user/login        *Users --> @login');
	// ROUTE('+GET  /api/user/logout       *Users --> @logout');

	ROUTE('GET   /api/industry        *Industry --> query');
	ROUTE('POST   /api/industry        *Industry --> insert');
	ROUTE('+DELETE   /api/industry/{id}        *Industry --> remove');
	ROUTE('+PUT   /api/industry/{id}        *Industry --> update');

	ROUTE('POST   /api/support        *Support --> findOne');

	CORS()
};