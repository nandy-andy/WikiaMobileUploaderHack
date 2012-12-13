function FirstView() {
	function sendPhoto(media, username, password, self) {
		var token;
		var serverUrl = 'http://nandytest.wikia.com/api.php';
		var loginXhr = Titanium.Network.createHTTPClient();
		loginXhr.onerror = function(e) {
			Ti.API.info('IN ERROR ' + e.error);
			alert('Sorry, we could not upload your photo! Please try again.');
		};
		loginXhr.open('POST', serverUrl); //the server location comes from the 'strings.xml' file
		//lgname: 'AndLuk',
		//lgpassword: 'test123nandy',
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
	function printObject(object) {
		var output = '';
		for (property in object) {
			output += property + ': ' + object[property]+'; ';
		}
		return output;
	}
	// Let's hide the status bar on the iphone/ipad for neatness
	if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
		Titanium.UI.iPhone.statusBarHidden = true;
	}   
	// Create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView({
		backgroundColor: '#232323'
	});
	// The view below is the background of the slider
	var progressBackgroundView = Ti.UI.createView({
		width: 300,
		height: 27,
		left: ((Ti.Platform.displayCaps.platformWidth - 300) / 2),
		top: (Ti.Platform.displayCaps.platformHeight / 2),
		visible: false,
		backgroundImage: 'assets/images/track-complete.png'
	});
	self.add(progressBackgroundView);
	//the slider will show a graphical representation of the upload progress
	//backgroundImage will reduce flicker as it doesn't redraw every width change like 'image' will
	var progressView = Ti.UI.createImageView({
		width: 0,
		height: 25,
		left: 1,
		top: 1,
		backgroundImage: 'assets/images/bar.jpg',
		borderRadius: 3
	});
	progressBackgroundView.add(progressView);   
	//this label will show the upload progress as a percentage (i.e. 25%)
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
	self.add(lblSending);
	//this button will appear initially and allow the
	//user to choose a photo from their gallery
	var formUsername = Titanium.UI.createTextField({
		top: 40,
		width: 400,
		height: 80,
		hintText: 'User name',
		keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType: Titanium.UI.RETURNKEY_NEXT,
		suppressReturn: false
	});
	var formPassword = Titanium.UI.createTextField({
		top: 160,
		width: 400,
		height: 80,
		hintText: 'Password',
		keyboardType: Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType: Titanium.UI.RETURNKEY_NEXT,
		suppressReturn: false,
		passwordMask: true
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
	self.add(formUsername);
	self.add(formPassword);
	self.add(btnChoosePhoto);
	function UploadPhotoToServer2(media) {
		if (Titanium.Network.online == true) {
			var label = self.children[1];
			var usernameTextField = self.children[2];
			var passwordTextField = self.children[3];
			var uploadButton = self.children[4];
			if( usernameTextField.value == "" || passwordTextField.value == "" ) {
				label.text = 'Invalid username and password!';
			} else {
				label.text = 'Uploading photo, please wait...';
				sendPhoto(media, usernameTextField.value, passwordTextField.value, self);
			}
		}
		else {
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
			self.children[1].text = 'YEAH!'; //change the status label
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
module.exports = FirstView;
