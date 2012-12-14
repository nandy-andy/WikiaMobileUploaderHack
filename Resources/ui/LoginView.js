function LoginView(WikiaApp) {
	if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
		Titanium.UI.iPhone.statusBarHidden = true;
	}
	
	var self = Ti.UI.createView({
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
		top: 570,
		width: 'auto',
		height: 20,
		font: {fontFamily: 'Arial', fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		textAlign: 'right',
		visible: false
	});
	
	//event listeners
	btnLogin.addEventListener('click', function(e) {
		var user = WikiaApp.getUser();
		var username = self.children[0].value;
		var password = self.children[1].value;
		
		user.setUserName(username, true);
		user.setPassword(password, true);
		var result = user.logIn();
		
		if( user.isLoggedIn() ) {
			self.hide();
		} else {
			var statusLabel = self.children[3];
			switch(result) {
				case 1:
					//success
					break;
				case -1:
				case -2:
					statusLabel.text = 'Invalid username or password. Please try again.';
					break;
				case -3:
					statusLabel.text = 'Your device needs to be connected to Internet while using this application.';
					break;
				default:
					statusLabel.text = 'User autherization error...';
					break;
			}
		}
	});
	
	//adding all controlls to view
	self.add(fieldUsername);
	self.add(fieldPassword);
	self.add(btnLogin);
	self.add(lblStatus);
	
	var userNameFromProps = WikiaApp.getUser().getUserNameFromAppProps();
	if( userNameFromProps !== '' ) {
		WikiaApp.getLogger().log(userNameFromProps);
		self.children[0].value = userNameFromProps;
	}
	
	var passwordFromProps = WikiaApp.getUser().getPasswordFromAppProps();
	if( passwordFromProps !== '' ) {
		WikiaApp.getLogger().log(passwordFromProps);
		self.children[1].value = passwordFromProps;
	}
	
	return self;
};

LoginView.prototype.show = function() {
	this.show();
};

LoginView.prototype.hide = function() {
	this.hide();
};

exports.LoginView = LoginView;