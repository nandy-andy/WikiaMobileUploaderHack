//Application Window Component Constructor
function ApplicationWindow(WikiaApp) {
	this.WikiaApp = WikiaApp;
	this.window = Ti.UI.createWindow({
		backgroundColor: '#ffffff',
		navBarHidden: true,
		exitOnClose: true
	});
};

ApplicationWindow.prototype.init = function() {
	var MainView = require('ui/MainView');
	//todo: would be nice to find a way not to pass WikiaApp everywhere...
	this.mainView = new MainView(this.WikiaApp);
	this.window.add(this.mainView);
	
	var LoginView = require('ui/LoginView');
	//todo: would be nice to find a way not to pass WikiaApp everywhere...
	this.loginView = new LoginView(this.WikiaApp);
	this.window.add(this.loginView);
	
	this.window.open();
}

ApplicationWindow.prototype.getMainView = function() {
	return this.mainView;
};

ApplicationWindow.prototype.getLoginView = function() {
	return this.loginView;
};

module.exports = ApplicationWindow;