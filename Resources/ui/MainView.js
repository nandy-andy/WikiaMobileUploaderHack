function MainView(WikiaApp) {
	this.app = WikiaApp;
	var that = this;
	var self = Ti.UI.createView({
		backgroundColor: '#232323'
	});
	this.view = self;

	function sendPhoto(media, self) {
		var token;
		var serverUrl = 'http://nandytest.wikia.com/api.php';
		var loginXhr = Titanium.Network.createHTTPClient();
		var username = WikiaApp.user.getUserName();
		var password = WikiaApp.user.getPassword();
		loginXhr.open('POST', serverUrl);
		loginXhr.send({
			action: 'login',
			lgname: username,
			lgpassword: password,
			format: 'json'
		});
		loginXhr.onload = function() {
			var responseObject = JSON.parse(this.responseText);
			token = responseObject.login.token;
			loginXhr.open('POST', serverUrl);
			loginXhr.send({
				action: 'login',
				lgname: username,
				lgpassword: password,
				lgtoken: token,
				format: 'json'
			});
			loginXhr.onload = function() {
				loginRequest(token, this, media, serverUrl, self);
			};
		}
		loginXhr.onerror = function(e) {
			Ti.API.info('IN ERROR ' + e.error);
			alert('Sorry, we could not upload your photo! Please try again.');
		};
	}

	function UploadPhotoToServer2(media) {
		var label = that.getSendingLabel();
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
	
	function sendFile(loginXhr, media, token, serverUrl, view) {
		Ti.API.info('SEND FILE QUERY:');
		Ti.API.info('token: ' + token);
		Ti.API.info('response: ' + loginXhr.responseText);
		var responseObject = JSON.parse(loginXhr.responseText);
		var pages = responseObject.query.pages;
		for( i in pages ) {
			token = pages[i].edittoken;
		}
		loginXhr.open('POST', serverUrl);
		loginXhr.setRequestHeader("enctype", "multipart/form-data");
		loginXhr.setRequestHeader("Connection", "close");
		loginXhr.send({
			token: token,
			action: 'upload',
			comment: 'WikiaUploader automatic upload',
			filename: getFileName() + '.jpg',
			file: media,
			format: 'json'
		});
		loginXhr.onload = function() {
			recentUrlAddUrl(serverUrl);
			sendFileCallback(this, view, token);
		};
		loginXhr.onerror = function(e) {
			Ti.API.info('IN ERROR ' + e.error);
			alert('Sorry, we could not upload your photo! Please try again.');
		};
	}
	
	function sendFileCallback(loginXhr, view, token) {
		Ti.API.info('IN ONLOAD ' + loginXhr.status + ' readyState ' + loginXhr.readyState);
		if( loginXhr.responseText != 'false' ) {
			Ti.API.info('FILE UPLOAD:');
			Ti.API.info('token: ' + token);
			Ti.API.info(loginXhr.responseText);
			that.getSendingLabel().text = 'YEAH!'; //change the status label
			var responseObject = JSON.parse(loginXhr.responseText);
			Ti.API.info('==============');
			Ti.API.info(responseObject.upload.result);
			return true;
		} else {
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

	function renderPicker(self) {
		var picker = Ti.UI.createPicker({
			top:170,
			width: 400,
			height: 80,
		});
		recentArray = Titanium.App.Properties.getList('recentUrl');
		if (recentArray) {
			var data = [];
			for (var i = 0; i < recentArray.length; i++) {
				data[i]=Ti.UI.createPickerRow({title: recentArray[i]});
			}
			picker.add(data);
			picker.selectionIndicator = true;
			picker.addEventListener('change', function(e) {
				self.children[1].value = e.selectedValue[0];
			});
			return picker;
		}
		else {
			return false;
		}
	}

	function recentUrlAddUrl(url) {
		recentArray = Titanium.App.Properties.getList('recentUrl');
		if (recentArray) {
			for (var i = 0; i < recentArray.length; i++) {
				if (recentArray[i] == url) {
					return false;
				}
			}
			recentArray.push(url);
		}
		else {
			var recentArray = [];
			recentArray[0] = url;
		}
		Titanium.App.Properties.setList('recentUrl', recentArray);
	}

	function loginRequest(token, loginXhr, media, serverUrl, view) {
		//loginRequest(token, this, media, serverUrl, self);
		Ti.API.info('LOGIN:');
		Ti.API.info('token: '+ token);
		Ti.API.info('url: '+ loginXhr.responseText);
		var responseObject = JSON.parse(loginXhr.responseText);
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
			sendFile(this, media, token, serverUrl, view);
		};
		loginXhr.onerror = function(e) {
			Ti.API.info('IN ERROR ' + e.error);
			alert('Sorry, we could not login you.');
		};
	}
	
	var lblDescription = Ti.UI.createLabel({
		width: 'auto',
		top: 15,
		text: 'Put wiki URL or select it from recent wikis',
		height: 20,
		font: {fontFamily: 'Arial', fontSize: 19, fontWeight: 'bold'},
		color: '#fff',
	});

	var formUrl = Titanium.UI.createTextField({
		top: 60,
		width: 400,
		height: 80,
		hintText: 'e.g. gta.wikia.com',
		keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType: Titanium.UI.RETURNKEY_NEXT,
		suppressReturn: false
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

	var btnChoosePhoto = Ti.UI.createButton({
		top: 280,
		width: 400,
		height: 150,
		title: '(v.0.2) Select photo for upload',
		font: {fontSize: 24, fontFamily: 'Arial'},
		color: '#000000',
		visible: true
	});

	btnChoosePhoto.addEventListener('click', function(e){
		WikiaApp.logger.log("btnChoosePhoto clicked!!");
		Titanium.Media.openPhotoGallery({
			success: function(event) {
				WikiaApp.logger.log('Image type is: ' + event.mediaType);
				Ti.API.debug('Our type was: '+event.mediaType);
				if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					UploadPhotoToServer2(event.media);
				}
			},
			cancel: function() {
				WikiaApp.logger.log('openPhotoGallery cancel');
			},
			error: function(err) {
				WikiaApp.logger.log('openPhotoGallery error');
				Ti.API.error(err);
			},
			mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
		});
	});
	
	self.add(lblDescription);
	self.add(formUrl);
	if( Titanium.App.Properties.getList('recentUrl') ) {
		self.add(renderPicker(self));
	}
	self.add(btnChoosePhoto);
	self.add(lblSending);

	return self;
};

MainView.prototype.getDescriptionLabel = function() {
	return this.view.getChildren()[0];
};

MainView.prototype.getUrlField = function() {
	return this.view.getChildren()[1];
};

MainView.prototype.getSendingLabel = function() {
	if( Titanium.App.Properties.getList('recentUrl') ) {
		return this.view.getChildren()[4];
	}
	
	return this.view.getChildren()[3];
};

exports.MainView = MainView;
