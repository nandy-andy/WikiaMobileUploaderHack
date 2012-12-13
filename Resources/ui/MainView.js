function MainView(WikiaApp) {
	function sendPhoto(media, self) {
		var token;
		var serverUrl = 'http://nandytest.wikia.com/api.php';
		var loginXhr = Titanium.Network.createHTTPClient();
		var username = WikiaApp.user.getUserName();
		var password = WikiaApp.user.getPassword();
		
		loginXhr.onerror = function(e) {
			Ti.API.info('IN ERROR ' + e.error);
			alert('Sorry, we could not upload your photo! Please try again.');
		};
		loginXhr.open('POST', serverUrl); //the server location comes from the 'strings.xml' file
		
		loginXhr.send({
			action: 'login',
			lgname: username,
			lgpassword: password,
			format: 'json'
		});
		loginXhr.onload = function() {
			var responseObject = eval('('+this.responseText+')');
			token = responseObject.login.token;
			loginXhr.open('POST', serverUrl); //the server location comes from the 'strings.xml' file			
			loginXhr.send({
				action: 'login',
				lgname: username,
				lgpassword: password,
				lgtoken: token,
				format: 'json'
			});
			loginXhr.onload = function() {
				Ti.API.info('LOGIN:');
				Ti.API.info('token: '+token);
				Ti.API.info('url: '+this.responseText);
				var responseObject = eval('('+this.responseText+')');
				token = responseObject.login.lgtoken;
				loginXhr.open('GET', serverUrl);
				loginXhr.send({
					format: 'json',
					action: 'query',
					prop: 'info',
					intoken: 'edit',
					titles: 'WikiaMobileUploadArticle'
				});
				loginXhr.onload = function() {
					sendFile(loginXhr, media, token, this, serverUrl);
				};
				loginXhr.onerror = function(e) {
					Ti.API.info('IN ERROR ' + e.error);
					alert('Sorry, we could not login you.');
				};
			};
		}
	}
	
	function UploadPhotoToServer2(media) {
		if (Titanium.Network.online == true) {
			var label = self.children[0];
			var uploadButton = self.children[2];
			
			label.text = 'Uploading photo, please wait...';
			sendPhoto(media, self);
		}
		else {
			label.text = 'You must have a valid Internet connection in order to upload this photo.';
		}
		label.show();
	}
	
	var self = Ti.UI.createView({
		backgroundColor: '#232323'
	});  
	
	var lblSending = Ti.UI.createLabel({
		width: 'auto',
		right: ((Ti.Platform.displayCaps.platformWidth - 300) / 2),
		top: ((Ti.Platform.displayCaps.platformHeight / 2) + 30),
		text: '',
		height: 20,
		font: {fontFamily: 'Arial', fontSize: 14, fontWeight: 'bold'},
		color: '#fff',
		textAlign: 'right',
		visible: false
	});
	
	var formUrl = Titanium.UI.createTextField({
		top: 40,
		width: 400,
		height: 80,
		hintText: 'URL',
		keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType: Titanium.UI.RETURNKEY_NEXT,
		suppressReturn: false
	});
	
	var btnChoosePhoto = Ti.UI.createButton({
		top: 280,
		width: 400,
		height: 150,
		title: 'Select photo for upload',
		font: {fontSize: 24, fontFamily: 'Arial'},
		color: '#000000',
		visible: true
	});
	
	btnChoosePhoto.addEventListener('click', function(e){
		Titanium.Media.openPhotoGallery({
			success:function(event) {
				Ti.API.debug('Our type was: '+event.mediaType);
				if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					UploadPhotoToServer2(event.media);
				}
			},
			cancel:function() {},
			error:function(err) {Ti.API.error(err);},
			mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
		});
	});
	
	self.add(lblSending);
	self.add(formUrl);
	self.add(btnChoosePhoto);

	function UploadPhotoToServer2(media) {
		var label = self.children[0];
		var uploadButton = self.children[2];
		
		if (Titanium.Network.online == true) {
			WikiaApp.logger.logObj(self.children);
			label.text = 'Uploading photo, please wait...';
			sendPhoto(media, self);
		} else {
			label.text = 'You must have a valid Internet connection in order to upload this photo.';
		}
		label.show();
	}
	
	function sendFile(loginXhr, media, token, that, serverUrl) {
		Ti.API.info('SEND FILE QUERY:');
		Ti.API.info('token: ' + token);
		Ti.API.info('url: ' + that.responseText);
		var responseObject = eval('(' + that.responseText + ')');
		var pages = responseObject.query.pages;
		for (i in pages) {
			token = pages[i].edittoken;
		}
		loginXhr.open('POST', serverUrl);
		loginXhr.setRequestHeader("enctype", "multipart/form-data");
		loginXhr.setRequestHeader("Connection", "close");
		loginXhr.send({
			token: token,
			action: 'upload',
			comment: 'wikia mobile upload',
			filename: getFileName() + '.jpg',
			file: media,
			format: 'json'
		});
		loginXhr.onload = function() {
			sendFileCallback(that, self, responseObject, token);
		};
		loginXhr.onerror = function(e) {
			Ti.API.info('IN ERROR ' + e.error);
			alert('Sorry, we could not upload your photo! Please try again.');
		};
	}
	
	function sendFileCallback(that, self, responseObject, token) {
		//For future use:
		//Titanium.App.Properties.setString("memoryUserName", "teeeeeest");
		//var memUserName = Titanium.App.Properties.getString("memoryUserName");
		Ti.API.info('IN ONLOAD ' + that.status + ' readyState ' + that.readyState);
		if(that.responseText != 'false') {
			Ti.API.info('FILE UPLOAD:');
			Ti.API.info('token: '+token);
			Ti.API.info(that.responseText);
			self.children[0].text = 'YEAH!'; //change the status label
			var responseObject = eval('('+that.responseText+')');
			Ti.API.info('==============');
			Ti.API.info(responseObject.upload.result);
			return true;
		}
		else {
			alert('Whoops, something failed in your upload script.');
			return false;
		}
	}
	
	function getFileName() {
		var cd = new Date();
		var m = cd.getMonth() + 1;
		var month = (m < 10) ? '0' + m : m;
		var day = (cd.getDate() < 10) ? '0' + cd.getDate() : cd.getDate();
		var fileName = cd.getFullYear()+'_'+month+'_'+day+' '+cd.getHours()+'_'+cd.getMinutes()+'_'+cd.getSeconds()+'_'+cd.getMilliseconds();
		return fileName;
	}
	
	return self;
};

MainView.prototype.show = function() {
	this.show();
};

MainView.prototype.hide = function() {
	this.hide();
};

module.exports = MainView;
