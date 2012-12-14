//Application Window Component Constructor
function ApplicationWindow() {
	var User = require('modules/User').User,
		Logger = require('modules/Logger').Logger;
		
	this.user = new User(); 
	this.logger = new Logger();
	this.window = Ti.UI.createWindow({
		backgroundColor: '#ffffff',
		navBarHidden: true,
		exitOnClose: true
	});
};

ApplicationWindow.prototype.init = function() {
	var MainView = require('ui/MainView').MainView,
		LoginView = require('ui/LoginView').LoginView;
	
	this.mainView = new MainView(this);
	this.loginView = new LoginView(this);
	this.loginView.doCheckInternetConnection();
	this.loginView.doFillFieldsWithAppData();
	
	this.window.add(this.mainView);
	this.window.add(this.loginView.view);
	this.window.open();
}

ApplicationWindow.prototype.getMainView = function() {
	return this.mainView;
};

ApplicationWindow.prototype.getLoginView = function() {
	return this.loginView;
};

ApplicationWindow.prototype.getUser = function() {
	return this.user;
};

ApplicationWindow.prototype.getLogger = function() {
	return this.logger;
};

exports.ApplicationWindow = ApplicationWindow;