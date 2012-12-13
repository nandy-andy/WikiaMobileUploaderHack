function User(userName, password) {
	this.userName = userName;
	this.password = password;
	this.session = '';
	this.loggedIn = false;
	this.loggedToAPI = false;
}

User.prototype.getUserName = function() {
	return this.userName;
}

User.prototype.setUserName = function(userName) {
	this.userName = userName;
}

User.prototype.getPassword = function(password) {
	return this.password;
}

User.prototype.setPassword = function(password) {
	this.password = password;
}

User.prototype.isLoggedIn = function() {
	return this.loggedIn;
}

User.prototype.isLoggedToAPI = function() {
	return this.loggedToAPI;
}

User.prototype.logIn = function() {
	var result = 1;
	
	if( this.userName === '' || typeof(this.userName) !== 'string' ) {
		return -1;
	} else if( this.password === '' || typeof(this.userName) !== 'string' ) {
		return -2;
	}
	
	this.loggedIn = true;
	
	return result;
}

module.exports = User;