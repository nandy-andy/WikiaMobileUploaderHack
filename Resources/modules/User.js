function User() {
	//"constants"	
	this.APP_PROPS_USER_NAME_KEY = 'WikiaAppUserName';
	this.APP_PROPS_PASSWORD_KEY = 'WikiaAppPassword';
	
	this.LOGGED_IN = 'loggedIn';
	this.LOGGED_OFF = 'loggedOff';
	
	this.API_DEFAULT_URL = 'http://www.wikia.com/api.php';
	
	this.API_RESPONSE_SUCCESS = 'Success';
	this.API_RESPONSE_NOT_EXISTS = 'NotExists';
	this.API_RESPONSE_WRONG_PASS = 'WrongPass';
	this.API_RESPONSE_NEED_TOKEN = 'NeedToken';
	this.API_RESPONSE_THROLLED = 'Throttled';
	
	this.LOGIN_VALIDATION_SUCCESS = 1;
	this.LOGIN_VALIDATION_INVALID_USERNAME = -1;
	this.LOGIN_VALIDATION_INVALID_PASSWORD = -2;
	this.LOGIN_VALIDATION_NO_INTERNET_CONNECTION = -3;
	this.LOGIN_VALIDATION_WAIT = -4;
	this.LOGIN_VALIDATION_INVALID_API_RESPONSE = 0;
	
	//"properties"
	this.userName = '';
	this.password = '';
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
	var result = this.LOGIN_VALIDATION_SUCCESS;
	
	if( username === '' || typeof(username) !== 'string' ) {
		result = this.LOGIN_VALIDATION_INVALID_USERNAME;
	} else if( password === '' || typeof(password) !== 'string' ) {
		result = this.LOGIN_VALIDATION_INVALID_PASSWORD;
	}
	
	this.userName = username;
	this.password = password;
	
	return result;
}

User.prototype.logInViaAPI = function(app, url) {
	var self = this;
	
	if( !url ) {
		var apiUrl = this.API_DEFAULT_URL;
	}
	
	var loginXhr = Titanium.Network.createHTTPClient({
		timeout: 5000
	});
	
	loginXhr.onerror = function(e) {
		app.getLogger().log('== XHR ERROR: ==');
		app.getLogger().logObj(e.error);
	};

	var apiArgs = {
		action: 'login',
		lgname: this.userName,
		lgpassword: this.password,
		format: 'json'
	};
		
	loginXhr.onload = function(e) {
		self.onTokenRequestSent(this, app, self, apiUrl);
	};
	
	loginXhr.open('POST', apiUrl);
	loginXhr.send(apiArgs);
}

User.prototype.onTokenRequestSent = function(loginXhr, app, userInstance, apiUrl) {
	var token = userInstance.validateXhrLoginResponse(loginXhr.responseText, app);
	app.getLogger().log(token, 'token');
	
	var apiArgs = {
		action: 'login',
		lgname: userInstance.userName,
		lgpassword: userInstance.password,
		lgtoken: token,
		format: 'json'
	};
	
	loginXhr.onload = function(e) {
		userInstance.onLoginRequestSent(loginXhr, app, userInstance);
	};
	loginXhr.open('POST', apiUrl);
	loginXhr.send(apiArgs);
}

User.prototype.onLoginRequestSent = function(loginXhr, app, userInstance) {
	var validationCode = userInstance.validateXhrLoginResponse(loginXhr.responseText, app);
	
	if( validationCode === 1 ) {
		this.loggedIn = true;
	} else {
		this.loggedIn = false;
	}
				
	app.window.fireEvent('wikiaAppUserLogInStateChanged', {
		currentState: (this.isLoggedIn() ? this.LOGGED_IN : this.LOGGED_OFF),
		preValidation: validationCode
	});
}

User.prototype.validateXhrLoginResponse = function(responseText, app) {
	results = JSON.parse(responseText);
	
	if( results.login && results.login.result ) {
		switch(results.login.result) {
			case this.API_RESPONSE_NEED_TOKEN:
				return ( (results.login && results.login.token) ? results.login.token : false);
				break;
			case this.API_RESPONSE_SUCCESS:
				return this.LOGIN_VALIDATION_SUCCESS;
				break;
			case this.API_RESPONSE_NOT_EXISTS:
			case this.API_RESPONSE_WRONG_PASS:
				return this.LOGIN_VALIDATION_INVALID_USERNAME;
				break;
			case this.API_RESPONSE_THROLLED:
				return this.LOGIN_VALIDATION_WAIT;
				break;
			default:
				return this.LOGIN_VALIDATION_INVALID_API_RESPONSE;
				break;
		}
	} else {
		return this.LOGIN_VALIDATION_INVALID_API_RESPONSE;
	}
}

exports.User = User;