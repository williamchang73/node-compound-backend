load('application');

before(use('checkLogin'), {
	only : ['edit', 'update', 'create', 'by_user']
});

before(loadCompany, {
	only : ['show', 'edit', 'update', 'destroy']
});

action('new', function() {
	this.title = 'New company';
	this.company = new Company;
	render();
});

action(function create() {
	//set userid
	req.body.Company.userid = req.userid;

	//change the company name to tempname
	req.body.Company.name = req.body.Company.name.replace(/[^\w]/gi, '') + '_' + Math.random().toString(36).substring(12);
	req.body.Company.data = require('configie').get('defaultdata').company;

	Company.create(req.body.Company, function(err, company) {
		respondTo(function(format) {
			format.json(function() {
				if (err) {
					send({
						code : 500,
						error : company && company.errors || err
					});
				} else {
					send({
						code : 200,
						data : company.toObject()
					});
				}
			});
			format.html(function() {
				if (err) {
					flash('error', 'Company can not be created');
					render('new', {
						company : company,
						title : 'New company'
					});
				} else {
					flash('info', 'Company created');
					redirect(path_to.companies);
				}
			});
		});
	});
});

action(function index() {
	this.title = 'Companys index';
	Company.all(function(err, companies) {
		switch (params.format) {
			case "json":
				send({
					code : 200,
					data : companies
				});
				break;
			default:
				render({
					companies : companies
				});
		}
	});
});

action(function show() {
	this.title = 'Company show';
	switch(params.format) {
		case "json":
			send({
				code : 200,
				data : this.company
			});
			break;
		default:
			render();
	}
});

action(function edit() {

	this.title = 'Company edit';
	switch(params.format) {
		case "json":
			send(this.company);
			break;
		default:
			render();
	}
});

action(function update() {

	//check the company's user id is the same with token
	var myip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	if ((req.userid != this.company.userid) && myip != '127.0.0.1') {
		response({}, '108');
	} else {
		//convert string to object
		var obj = req.body.Company['data'];
		try{
			if(typeof obj == "string"){
				obj = JSON.parse(obj);	
			}
		}catch(e){
        	console.error(e);
    	}
		if(typeof obj != "object"){
			response({}, '109');
			return;
		}
		req.body.Company['data'] = obj;
		
		var company = this.company;
		this.title = 'Edit company details';
		this.company.updateAttributes(body.Company, function(err) {
			respondTo(function(format) {
				format.json(function() {
					if (err) {
						send({
							code : 500,
							error : company && company.errors || err
						});
					} else {
						send({
							code : 200,
							data : company
						});
					}
				});
				format.html(function() {
					if (!err) {
						flash('info', 'Company updated');
						redirect(path_to.company(company));
					} else {
						flash('error', 'Company can not be updated');
						render('edit');
					}
				});
			});
		});

	}

});

action(function destroy() {

	//check the company's user id is the same with token
	if (req.userid != this.company.userid) {
		response({}, '108');
	}

	this.company.destroy(function(error) {
		respondTo(function(format) {
			format.json(function() {
				if (error) {
					send({
						code : 500,
						error : error
					});
				} else {
					send({
						code : 200
					});
				}
			});
			format.html(function() {
				if (error) {
					flash('error', 'Can not destroy company');
				} else {
					flash('info', 'Company successfully removed');
				}
				send("'" + path_to.companies + "'");
			});
		});
	});
});

function loadCompany() {

	Company.find(params.id, function(err, company) {
		if (err || !company) {
			if (!err && !company && params.format === 'json') {
				return send({
					code : 404,
					error : 'Not found'
				});
			}
			redirect(path_to.companies);
		} else {
			this.company = company;
			next();
		}
	}.bind(this));
}

// for customize api =============
var response = use('response');

function filterResult(company) {
	company.id = '';
	company.userid = '';
	return company;
}

/**
 * find which company urls belong to this person
 */
action('by_user', function() {
	console.log(req.userid);
	Company.getCompanyByUser(req.userid, function(err, company) {
		ret = [];
		if (company != null) {
			ret.push({
				'name' : company.name,
				'status' : company.status,
				'id' : company.id
			});
		}
		response(ret, 200);
	});
});

/**
 * find which company by name
 */
action('by_name', function() {
	Company.getCompanyByName(req.body.name, function(err, company) {
		if (company != null) {
			if (company.status == 0) {//need to check login
				if (req.body.key == company.id) {
					response(filterResult(company), 200);
				} else {
					response({}, 108);
				}
			} else {
				response(filterResult(company), 200);
			}
		} else {
			response({}, 107);
		}
	});
});

