(function() {
	var User = require('modules/User');
	var Logger = require('modules/Logger');
	var WikiaApp = {
		user: new User(),
		logger: new Logger()
	};
	
	var ApplicationWindow = require('ui/ApplicationWindow');
	var app = new ApplicationWindow(WikiaApp);
	app.init();
})();