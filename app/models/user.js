module.exports = function(compound, User) {

	User.getUserByEmail = function getUserByEmail(email, callback) {
		this.findOne({
			where : {
				"email" : email
			}
		}, callback);
	}
};
