var logger = require('../../config/logger.js');

//File update dependency
var fs = require('fs');
var rootPath = "public/";
var storageDir = "uploaded/";
var bashPath = rootPath + storageDir;

//function will check if a directory exists, and create it if it doesn't
function checkDirectory(directory, callback) {  
  directory = bashPath + directory;
  
  // fs.stat(directory, function(err, stats) {
  //   //Check if error defined and the error code is "not exists"
  //   console.log("Error no: " +err.errno);
  //   if (err && err.errno === -2 ) {
  //     //Create the directory, call the callback.
  //     fs.mkdir(directory, callback);
  //   } else {
  //     //just in case there was a different error:
  //     callback(err)
  //   }
  // });
//Santosh commented the above code and added the below one line instead as the above code did not work if permission was not there to create directory
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, 0744);
  }

}


module.exports = {

  upload: function(req, response) {
    try {
      var hostURL = req.headers['referer'];
      console.log("hostURL " + hostURL);
      var directory = req.headers['userid'] || req.headers['restid'], responseFilePaths = [];
      console.log("directory " + directory);
      if (!req.files) {
          response.send('No files were uploaded.');
          return;
      } 
      if(checkDirectory(directory, function(dir){return (dir)})){
        directory = ''; 
      }

      var isAnyUploadError = false;
      setTimeout(function() {
        for(var file in req.files){
          req.files[file].mv(bashPath + directory + '/' + req.files[file].name.replace(/\s/g,'') , function(err) {
              if (err) {
                logger.info(err);
                isAnyUploadError = true;
                response.status(500).send(err + 'in ' + req.files[file]);
                return;
              }
          });
          responseFilePaths.push(hostURL + storageDir + directory + '/' + req.files[file].name.replace(/\s/g,''));
        }
        logger.info(responseFilePaths);
        if( !isAnyUploadError ) {
          return response.status(200).json({ "code": 200, "status": "File uploaded successfully!!", "files" : responseFilePaths});  
        }
      },100);
    } catch (error) {
        return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
    }
  },

  uploadUserProfileImage : function(req, response) {
    try {
      var userid = req.headers['userid'];
      if (!req.files) {
          return response.send('No files were uploaded.');
      }
      setTimeout(function() {
        var filename = req.files.file.name.replace(/\s/g,'');
        var ext = filename.substring(filename.lastIndexOf("."));
        req.files.file.mv(bashPath + "StarLLyUserProfileImages" + '/' + userid + ext , function(err) {
          if (err) {
            logger.info(err);
            return response.status(500).send(err + 'in ' + req.files.file);
          }
        });
        var responseFilePaths = storageDir + "StarLLyUserProfileImages" + '/' + userid + ext;
        return response.status(200).json({"status": "File uploaded successfully!!", "file" : responseFilePaths});
      },100);
    } catch (error) {
        return response.status(500).json({"status": "Internal Server Error!!" });
    }
  }
}