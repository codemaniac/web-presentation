var fs = require('fs');
var crypto = require('crypto');

presentations = {};

exports.presentations = presentations;

exports.index = function(req, res){
  res.render('index');
};

exports.present = function(req, res) {
  var filePath = req.files.presentationFile.path;
  var fileNameParts = filePath.split('/');
  var fileName = fileNameParts[fileNameParts.length - 1];
  var presenterName = req.body.inputName;
  var presentationTitle = req.body.inputTitle;
  var passphrase = req.body.inputPassword;
  crypto.randomBytes(12, function(ex, buf) {
    var token = buf.toString('hex');
    presentations[token] = {'name': presenterName, 'title': presentationTitle, 'passphrase': passphrase, 'file': fileName, 'pgno' : 1};
    res.render('presentation', {presenter : true, topic : presentationTitle, id : token, presentationFileName : fileName, pgno : 1});
  });  
}

exports.attend = function(req, res){
  var presentation = presentations[req.params.id];
  res.render('presentation', {presenter : false, topic : presentation.title, presentationFileName : presentation.file, id : req.params.id, pgno : presentation.pgno});
};
