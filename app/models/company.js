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

};