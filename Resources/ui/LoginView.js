function LoginView(WikiaApp) {
	// Let's hide the status bar on the iphone/ipad for neatness
	if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
		Titanium.UI.iPhone.statusBarHidden = true;
	}
	
	// Create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView({
		backgroundColor: '#232323'
	}); 
	
	//this button will appear initially and allow the
	//user to choose a photo from their gallery
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
	
	btnLogin.addEventListener('click', function(e) {
		var username = self.children[0].value;
		var password = self.children[1].value;
		
		WikiaApp.logger.log(username, 'username');
		WikiaApp.logger.log(password, 'password');
		WikiaApp.logger.log('WikiaApp.user: ');
		WikiaApp.logger.logObj(WikiaApp.user);
		WikiaApp.logger.log('self.children: ');
		WikiaApp.logger.logObj(self.children);
		
		WikiaApp.user.setUserName(username);
		WikiaApp.user.setPassword(password);
		WikiaApp.user.logIn();
		
		WikiaApp.logger.logObj(WikiaApp.user);
		
		WikiaApp.logger.log('WikiaApp.user.isLoggedIn(): ');
		WikiaApp.logger.log(WikiaApp.user.isLoggedIn());
		
		if( WikiaApp.user.isLoggedIn() ) {
			self.hide();
		} else {
			WikiaApp.logger.log('ERROR!');
		}
	});
	
	self.add(fieldUsername);
	self.add(fieldPassword);
	self.add(btnLogin);
	
	return self;
};

LoginView.prototype.show = function() {
	this.show();
};

LoginView.prototype.hide = function() {
	this.hide();
};

module.exports = LoginView;
