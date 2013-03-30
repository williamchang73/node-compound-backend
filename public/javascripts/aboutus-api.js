var AboutUsAPI = {};
var apiurl = 'http://127.0.0.1:3001';

AboutUsAPI.getCompanyList = function(data, token, callback) {
	data = data || { };
	
	var option = {
		'data' : data,
		'api' : '/companies.json?token='+token,
		'method' : 'GET' 
	};
	AboutUsAPI.call(option, callback);
}; 

AboutUsAPI.createCompany = function(data, token, callback) {
	data = data || { };

	var option = {
		'data' : data,
		'api' : '/companies.json?token='+token,
		'method' : 'POST' 
	};
	AboutUsAPI.call(option, callback);
	
}; 



AboutUsAPI.createUser = function(data, callback) {
	console.log('AboutUsAPI.createUser');
	data = data || { };

	var option = {
		'data' : data,
		'api' : '/users.json',
		'method' : 'POST' 
	};
	AboutUsAPI.call(option, callback);
}; 

AboutUsAPI.loginUser = function(data, callback) {
	data = data || { };

	var option = {
		'data' : data,
		'api' : '/users/login',
		'method' : 'POST' 
	};
	AboutUsAPI.call(option, callback);
}; 



AboutUsAPI.getCompaniesByUser = function(data, token, callback) {
	data = data || { };

	var option = {
		'data' : data,
		'api' : '/companies/by_user?token='+token,
		'method' : 'GET' 
	};
	AboutUsAPI.call(option, callback);
}; 




AboutUsAPI.getCompanyInfo = function(data, callback) {
	data = data || {};

	var option = {
		'data' : data,
		'api' : '/companies/by_name',
		'method' : 'POST',
		'async' : 'false' 
	};
	AboutUsAPI.call(option, callback);
}; 




AboutUsAPI.updateCompany = function(data, token, callback) {
	data = data || {};
	data._method = 'PUT';
	var option = {
		'data' : data,
		'api' : '/companies/'+data.key+'.json?token=' + token,
		'method' : 'POST' 
	};
	AboutUsAPI.call(option, callback);
}; 



AboutUsAPI.getCompanies = function(data, callback) {
	data = data || {};
	var option = {
		'data' : data,
		'api' : '/companies/all',
		'method' : 'GET'
	};
	AboutUsAPI.call(option, callback);
}; 



AboutUsAPI.call = function(option, callback) {
	var data = option.data || { };
	var api  = option.api;
	var async = option.async || true;
	if(async=='false'){
		async = false;
	}
	var method = option.method || "GET";
	$.ajax({
		type : method,
		url : apiurl + api,
		data : data,
	    async : async,
		success : function(response) {
			if(typeof response == 'string'){ //for some browser
				response = $.parseJSON(response)
			}
			if(response.code){
				response.status = response.code;
				response.status_msg = '';
				delete response.code;	
			}
			callback(response);
		},
		error : function(rs, e) {
			console.error(e);
			callback(false);
		}
	});
}; 
