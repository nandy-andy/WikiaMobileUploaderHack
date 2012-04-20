function FirstView() {
	function sendPhoto(media) {
		var token;
		var serverUrl = 'http://nandytest.wikia.com/api.php';
		var loginXhr = Titanium.Network.createHTTPClient();
		loginXhr.onerror = function(e) {
			Ti.API.info('IN ERROR ' + e.error);
			alert('Sorry, we could not upload your photo! Please try again.');
		};
		loginXhr.open('POST', serverUrl); //the server location comes from the 'strings.xml' file 
		loginXhr.send({
			action: 'login',
			lgname: 'AndLuk',
			lgpassword: 'test123nandy',
			format: 'json'
		});
		loginXhr.onload = function() {
			var responseObject = eval('('+this.responseText+')');
			token = responseObject.login.token;
			loginXhr.open('POST', serverUrl); //the server location comes from the 'strings.xml' file 
			loginXhr.send({
				action: 'login',
				lgname: 'AndLuk',
				lgpassword: 'test123nandy',
				lgtoken: token,
				format: 'json'
			});
			loginXhr.onload = function() {
				var tempUrl = this.responseText; //set our url variable to the response
				Ti.API.info('LOGIN:');
				Ti.API.info('token: '+token);
				Ti.API.info(tempUrl);
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
					var tempUrl = this.responseText;
					Ti.API.info('EDIT QUERY:');
					Ti.API.info('token: '+token);
					Ti.API.info(tempUrl);
					var responseObject = eval('('+this.responseText+')');
					var pages = responseObject.query.pages;
					for (i in pages) {
						token = pages[i].edittoken;
					}
					loginXhr.onerror = function(e) {
						Ti.API.info('IN ERROR ' + e.error);
						alert('Sorry, we could not upload your photo! Please try again.');
					};
					loginXhr.open('POST', serverUrl); //the server location comes from the 'strings.xml' file 
					loginXhr.setRequestHeader("enctype", "multipart/form-data");
					loginXhr.setRequestHeader("Connection", "close");
					var cd = new Date();
					var m = cd.getMonth() + 1;
					var month = (m < 10) ? '0' + m : m;
					var day = (cd.getDate() < 10) ? '0' + cd.getDate() : cd.getDate();
					var fileName = cd.getFullYear()+'_'+month+'_'+day+' '+cd.getHours()+'_'+cd.getMinutes()+'_'+cd.getSeconds()+'_'+cd.getMilliseconds();
					loginXhr.send({
						token: token,
						action: 'upload',
						comment: 'wikia mobile upload',
						filename: fileName + '.jpg',
						file: media,
						format: 'json'
					});
					loginXhr.onload = function() {
						Ti.API.info('IN ONLOAD ' + this.status + ' readyState ' + this.readyState);
						if(this.responseText != 'false') {
							Ti.API.info('FILE UPLOAD:');
							Ti.API.info('token: '+token);
							Ti.API.info(this.responseText);
						}
						else {
							alert('Whoops, something failed in your upload script.');
							self.children[0].hide(); //hide the status bar
							self.children[1].hide(); //hide the status label
							self.children[2].show(); //show the upload button again
							androidUploadProgress = 0; //reset the android progress value
						}
					};
				}
			};
		}
		return loginXhr;
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
	var btnChoosePhoto = Ti.UI.createButton({
		width: 400,
		height: 150,
		title: 'Select photo for upload (v.0.6)',
		font: {fontSize: 24, fontFamily: 'Arial'},
		color: '#000000',
		top: (Ti.Platform.displayCaps.platformHeight / 3),
		visible: true
	});
	var btnLogin = Ti.UI.createButton({
		width: 400,
		height: 150,
		title: 'Log in (v.0.4)',
		font: {fontSize: 24, fontFamily: 'Arial'},
		color: '#000000',
		top: (Ti.Platform.displayCaps.platformHeight / 4),
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
	btnLogin.addEventListener('click', function(e) {
		logInMe();
	});
	self.add(btnChoosePhoto);
	//self.add(btnLogin);
	function UploadPhotoToServer(media) {
		if (Titanium.Network.online == true) {
			self.children[0].show(); //show the uploading slider progress bar
			self.children[0].children[0].width = 0; //make sure the default value is zero
			self.children[1].show(); //show the uploading label
			self.children[1].text = 'Uploading photo, please wait...'; //set the label to default value
			self.children[2].hide(); //hide the select photo button
		}
		else {
			alert('You must have a valid Internet connection in order to upload this photo.');
		}
		var serverUrl = 'http://skchbk.foxnet.pl/upload/';
		var xhr = Titanium.Network.createHTTPClient();
		xhr.onerror = function(e) {
			Ti.API.info('IN ERROR ' + e.error);
			alert('Sorry, we could not upload your photo! Please try again.');
		};
		xhr.onload = function() {
			Ti.API.info('IN ONLOAD ' + this.status + ' readyState ' + this.readyState);
			if(this.responseText != 'false') {
				var url = this.responseText; //set our url variable to the response
				self.children[0].children[0].width = 298;  //set the progress to 100% (298px based on our design)                 
				//if we successfully uploaded, then ask the user if they want to view the photo
				var confirm = Titanium.UI.createAlertDialog({
					title: 'Upload complete!',
					message: 'Open your image in the browser?',
					buttonNames: ['Yes', 'No']
				});
				confirm.addEventListener('click', function(conEvt) {
					//if the index selected was 0 (yes) then open in safari
					Ti.API.info(conEvt.index);
					if(conEvt.index === 0) {
						//open our uploaded image in safari
						Ti.Platform.openURL(url);
					}
					//reset the upload button
					self.children[0].hide(); //hide the status bar
					self.children[1].hide(); //hide the status label
					self.children[2].show(); //show the upload button again
					androidUploadProgress = 0; //reset the android progress value
				});
				confirm.show();
			}
			else {
				alert('Whoops, something failed in your upload script.');
				self.children[0].hide(); //hide the status bar
				self.children[1].hide(); //hide the status label
				self.children[2].show(); //show the upload button again
				androidUploadProgress = 0; //reset the android progress value
			}
		};
		xhr.onsendstream = function(e){
			Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress);
		};
		// open the client
		xhr.open('POST', serverUrl); //the server location comes from the 'strings.xml' file 
		// send the data
		xhr.send({
			media: media
		});
	}
	function UploadPhotoToServer2(media) {
		if (Titanium.Network.online == true) {
			self.children[0].show(); //show the uploading slider progress bar
			self.children[0].children[0].width = 0; //make sure the default value is zero
			self.children[1].show(); //show the uploading label
			self.children[1].text = 'Uploading photo, please wait...'; //set the label to default value
			self.children[2].hide(); //hide the select photo button
		}
		else {
			alert('You must have a valid Internet connection in order to upload this photo.');
		}
		sendPhoto(media);
	}
	return self;
};
module.exports = FirstView;