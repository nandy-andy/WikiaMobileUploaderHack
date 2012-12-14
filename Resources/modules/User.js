function User(userName, password) {
	//"constants"	
	this.APP_PROPS_USER_NAME_KEY = 'WikiaAppUserName';
	this.APP_PROPS_PASSWORD_KEY = 'WikiaAppPassword';
	this.LOGGED_IN = 'loggedIn';
	this.LOGGED_OFF = 'loggedOff';
	
	//"properties"
	this.userName = userName;
	this.password = password;
	this.session = '';
	this.loggedIn = false;
}

User.prototype.getUserName = function() {
	return this.userName;
}

User.prototype.getPassword = function() {
	return this.password;
}

User.prototype.getUserNameFromAppProps = function() {
	return Titanium.App.Properties.getString(this.APP_PROPS_USER_NAME_KEY);
}

User.prototype.getPasswordFromAppProps = function() {
	return Titanium.App.Properties.getString(this.APP_PROPS_PASSWORD_KEY);
}

User.prototype.isLoggedIn = function() {
	return this.loggedIn;
}

User.prototype.addToAppProps = function() {
	Titanium.App.Properties.setString(this.APP_PROPS_USER_NAME_KEY, this.userName);
	Titanium.App.Properties.setString(this.APP_PROPS_PASSWORD_KEY, this.password);
}

User.prototype.preLogInValidation = function(username, password) {
	var result = 1;
	
	if( username === '' || typeof(username) !== 'string' ) {
		return -1;
	} else if( password === '' || typeof(username) !== 'string' ) {
		return -2;
	}
	
	this.userName = username;
	this.password = password;
	this.loggedIn = true;
	
	return result;
}

/*
User.propotype.changeLoggedInState = function() {
	
}

User.prototype.logInViaAPI = function(url, callback) {
	var serverUrl = 'http://nandytest.wikia.com/api.php';
		var loginXhr = Titanium.Network.createHTTPClient();
}
*/

exports.User = User;