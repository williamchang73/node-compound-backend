module.exports = function(compound, Company) {
	// define Company here

	Company.getCompanyByUser = function getCompanyByUser(userid, callback) {

		//get user first, check password
		var wheres = {
			where : {
				'userid' : userid
			}
		};
		this.findOne(wheres, callback);
	},
	
	
	
	Company.getCompanyByName = function getCompanyByUser(name, callback) {

		//get user first, check password
		var wheres = {
			where : {
				'name' : name
			}
		};
		this.findOne(wheres, callback);
	}
	
	
	Company.getCompanies = function getCompanies(page, callback) {
		
		page = page ? page : 0;
		count = 20;

		//get user first, check password
		//{where: {userId: user.id}, order: 'id', limit: 10, skip: 20}
		var wheres = {
			where : {
				'status' : "2"
			},
			order: 'update_time',
			limit : count,
			skip : page * count
		};
		this.all(wheres, callback);
	}


};