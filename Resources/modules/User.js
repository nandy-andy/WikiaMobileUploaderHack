function User(userName, password) {
	this.APP_PROPS_USER_NAME_KEY = 'WikiaAppUserName';
	this.APP_PROPS_PASSWORD_KEY = 'WikiaAppPassword';
	
	this.userName = userName;
	this.password = password;
	this.session = '';
	this.loggedIn = false;
	this.loggedToAPI = false;
}

User.prototype.getUserName = function() {
	return this.userName;
}

User.prototype.setUserName = function(userName, addToAppProps) {
	if( addToAppProps ) {
		Titanium.App.Properties.setString(this.APP_PROPS_USER_NAME_KEY, userName);
	}
	
	this.userName = userName;
}

User.prototype.getPassword = function(password) {
	return this.password;
}

User.prototype.setPassword = function(password, addToAppProps) {
	if( addToAppProps ) {
		Titanium.App.Properties.setString(this.APP_PROPS_PASSWORD_KEY, password);
	}
	
	this.password = password;
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

User.prototype.isLoggedToAPI = function() {
	return this.loggedToAPI;
}

User.prototype.logIn = function() {
	var result = 1;
	
	/*
	if( Titanium.Network.online !== true ) {
		return -3;
	}
	*/
	
	if( this.userName === '' || typeof(this.userName) !== 'string' ) {
		return -1;
	} else if( this.password === '' || typeof(this.userName) !== 'string' ) {
		return -2;
	}
	
	this.loggedIn = true;
	
	return result;
}

exports.User = User;