exports.routes = function(map) {
	
	
	map.get('companies/by_user', 'companies#by_user');
	map.get('companies/by_name', 'companies#by_name');
	map.get('companies/all', 'companies#all');
	
	map.get('users/login', 'users#login');
	

	map.resources('users');
	map.resources('companies');

	// Generic routes. Add all your routes below this line
	// feel free to remove generic routes
	map.all(':controller/:action');
	map.all(':controller/:action/:id');
	
}; 