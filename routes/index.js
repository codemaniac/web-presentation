var fs = require('fs');
var crypto = require('crypto');

/*
 * GET home page.
 */

presentations = {};

exports.index = function(req, res){
  res.render('index');
};

exports.home = function(req, res){
  res.render('home');
};

exports.upload = function(req, res) {
  var filePath = req.files.presentationFile.path;
  var fileNameParts = filePath.split('/');
  var fileName = fileNameParts[fileNameParts.length - 1];
  var presenterName = req.body.inputName;
  var presentationTitle = req.body.inputTitle;
  var passphrase = req.body.inputPassword;
  crypto.randomBytes(48, function(ex, buf) {
    var token = buf.toString('hex');
    presentations[token] = {'name': presenterName, 'title': presentationTitle, 'passphrase': passphrase, 'file': fileName};
    res.json({'name': presenterName, 'title': presentationTitle, 'passphrase': passphrase, 'file': fileName, 'token' : token});
  });  
}
