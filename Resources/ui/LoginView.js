function LoginView(WikiaApp) {
	self = this;
	this.app = WikiaApp;
	
	if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
		Titanium.UI.iPhone.statusBarHidden = true;
	}
	
	this.view = Ti.UI.createView({
		backgroundColor: '#232323'
	});
	
	//definitions of various controlls
	var fieldUsername = Titanium.UI.createTextField({
		top: 40,
		width: 400,
		height: 80,
		hintText: 'User name',
		keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType: Titanium.UI.RETURNKEY_NEXT,
		suppressReturn: false
	});
	
	var fieldPassword = Titanium.UI.createTextField({
		top: 160,
		width: 400,
		height: 80,
		hintText: 'Password',
		keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType: Titanium.UI.RETURNKEY_NEXT,
		suppressReturn: false,
		passwordMask: true
	});
	
	var btnLogin = Ti.UI.createButton({
		top: 280,
		width: 400,
		height: 150,
		title: 'Login',
		font: {fontSize: 24, fontFamily: 'Arial'},
		color: '#000000',
		visible: true
	});
	
	var lblStatus = Ti.UI.createLabel({
		top: 440,
		width: 'auto',
		height: 20,
		font: {fontFamily: 'Arial', fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		textAlign: 'right',
		text: '',
		visible: true
	});
	
	btnLogin.addEventListener('click', function(e) {
		var user = WikiaApp.getUser(),
			username = self.getUserNameField().value,
			password = self.getPasswordField().value,
			result = user.preLogInValidation(username, password);
		
		if( result === 1 ) {
			self.app.window.fireEvent('wikiaAppUserLogInStateChanged', {
				currentState: (user.isLoggedIn() ? user.LOGGED_IN : user.LOGGED_OFF),
				preValidation: result
			});
		} else {
			self.handleFailedLogin(result);
		}
	});
	
	//todo: add listener and change enable fields once the Internet is on
	/*
	Titanium.Network.addEventListener('change', function() {
		this.app.getLogger().log('CONNECTION STATE CHANGE');
	});
	*/
	
	//adding all controlls to view
	this.view.add(fieldUsername);
	this.view.add(fieldPassword);
	this.view.add(btnLogin);
	this.view.add(lblStatus);
	
	return this;
};

LoginView.prototype.show = function() {
	this.view.show();
};

LoginView.prototype.hide = function() {
	this.view.hide();
};

LoginView.prototype.getUserNameField = function() {
	return this.view.children[0];
};

LoginView.prototype.getPasswordField = function() {
	return this.view.children[1];
};

LoginView.prototype.getLoginButton = function() {
	return this.view.children[2];
};

LoginView.prototype.getLabelStatus = function() {
	return this.view.children[3];
};

LoginView.prototype.doFillFieldsWithAppData = function() {
	var userNameFromProps = this.app.getUser().getUserNameFromAppProps();
	if( userNameFromProps !== '' ) {
		this.getUserNameField().setValue(userNameFromProps);
	}
	
	var passwordFromProps = this.app.getUser().getPasswordFromAppProps();
	if( passwordFromProps !== '' ) {
		this.getPasswordField().setValue(passwordFromProps);
	}
};

LoginView.prototype.doCheckInternetConnection = function() {
	var statusLabel = this.getLabelStatus();
	if( Titanium.Network.getOnline() !== true ) {
		this.disableForm();
		statusLabel.setText('You need Internet connection to use this application.');
	} else {
		this.enableForm();
		statusLabel.setText('');
	}
};

LoginView.prototype.disableForm = function() {
	this.getUserNameField().setEnabled(false);
	this.getPasswordField().setEnabled(false);
	this.getLoginButton().setEnabled(false);
};

LoginView.prototype.enableForm = function() {
	this.getUserNameField().setEnabled(true);
	this.getPasswordField().setEnabled(true);
	this.getLoginButton().setEnabled(true);
};

LoginView.prototype.handleFailedLogin = function(result) {
	var output = '';
	
	switch(result) {
		case 1:
			//success
			break;
		case -1:
		case -2:
			output = 'Invalid username or password. Please try again.';
			break;
		case -3:
			output = 'Your device needs to be connected to Internet while using this application.';
			break;
		default:
			output = 'User autherization error...';
			break;
	}
	
	var statusLabel = this.getLabelStatus();
	statusLabel.setText(output);
	statusLabel.show();
}

exports.LoginView = LoginView;