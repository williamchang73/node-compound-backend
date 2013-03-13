var AboutUsAPI = {};
var apiurl = 'http://127.0.0.1:3001';

AboutUsAPI.getCompanyList = function(data, callback) {
	data = data || { };
	
	var option = {
		'data' : data,
		'api' : '/companies.json',
		'method' : 'GET' 
	};
	AboutUsAPI.call(option, callback);
}; 

AboutUsAPI.createCompany = function(data, callback) {
	data = data || { };

	var option = {
		'data' : data,
		'api' : '/companies.json',
		'method' : 'POST' 
	};
	AboutUsAPI.call(option, callback);
	
}; 



AboutUsAPI.call = function(option, callback) {
	var data = option.data || { };
	var api  = option.api;
	var method = option.method || "GET";
	$.ajax({
		type : method,
		url : apiurl + api,
		data : data,
		success : function(response) {
			callback(response);
		},
		error : function(rs, e) {
			console.error(e);
			callback(false);
		}
	});
}; 
