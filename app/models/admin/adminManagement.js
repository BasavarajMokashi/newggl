//Custome Dependency Modules
var database = require(__dirname + "/../database.js");
var logger = require('../../../config/logger.js');

module.exports = {

    auth: function(req, response) {
        try {
            var email = req.headers['email'];
            var pwd = req.headers['password'];
            if (email && pwd) {
                try {
                    var authQuery = "SELECT hex(uid) as uid, firstname, lastname, phone, email, dob, image_url, gender from user where (email='" + email + "' AND password='" + pwd + "')";
                    console.log(authQuery);
                    database.dbTransaction(req, response, authQuery, function(resultSet) {
                        if (resultSet && resultSet.length > 0) {
                            return response.status(200).json(resultSet[0]);
                        }else {
                            return response.status(400).json({ "code": 400, "status": "Invalid Credientials!!" });
                        }
                    });
                } catch (error) {
                    return response.status(400).json({ "code": 400, "status": "Invalid Credientials!!" });
                }
            } else {
                return response.status(400).json({ "code": 400, "status": "Email/Password is Empty!!" });
            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    }
}