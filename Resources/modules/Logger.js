function Logger() {};

Logger.prototype.log = function(varValue, varName) {
	var output = '';
	
	if( typeof(varName) === 'string' ) {
		output += varName + ': ';
	}
	
	if( typeof(varValue) !== 'string' ) {
		output += typeof(varValue);
	} else {
		output += varValue;
	}
	
	Ti.API.debug(output);
};

Logger.prototype.logObj = function(object) {
	var output = '';
	for( property in object ) {
		output += property + ': ' + object[property] + "\n";
	}
	
	Ti.API.debug('== DEBUG ==');
	Ti.API.debug(output);
	Ti.API.debug('== /DEBUG ==');
};

module.exports = Logger;
