//Custome Dependency Modules
var database = require(__dirname + "/../database.js");
var logger = require('../../../config/logger.js');

var dbDateFormate = function(dt) {
        return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
}

function createDemo(demo){
    return new Promise(function(resolve,reject){
        database.getDBConnection(connection => {
            var query = "INSERT INTO `demo`(`demoid`,`restaurant_name`,`contact_person_name`,`emailid`,`mobile_no`,`comment`) VALUES(unhex(replace(uuid(),'-','')),?,?,?,?,?)";
            connection.query(query,[demo.restaurant_name,demo.contact_person_name,demo.emailid,demo.mobile_no,demo.comment], function(err,result){
                connection.release();
                if(!err && result.insertId) {
                    resolve('success');
                } else {
                    reject(err);
                }        
            });
        });
    });
}

function getDemos(status){
    return new Promise(function(resolve,reject){
        database.getDBConnection(connection => {
            var query ="SELECT hex(`demoid`) AS demo_id,`restaurant_name`,`contact_person_name`,`emailid`,`mobile_no`,`comment`,`has_demo_given`,`demo_given_by`,`demo_date`,`has_registered`,`registered_on`,`created_date` FROM `demo`";
            if(status == 'new'){
                query = query + " WHERE `has_demo_given` = false";
            }else if(status == 'given'){
                query = query + " WHERE `has_demo_given` = true";
            }
            connection.query(query, function(err,result){
                connection.release();
                if(!err ) {
                    resolve(result);
                } else {
                    reject(err);
                }        
            });
        });
    });
}


function updateDemo(demo){
    return new Promise(function(resolve,reject){
        database.getDBConnection(connection => {
            var query = "UPDATE `demo` SET `has_demo_given` = ?,`demo_given_by` = ?,`demo_date` = ?,`has_registered` = ?,`registered_on` = ? WHERE hex(demoid) = ?";
            console.log(query);
            console.log(demo);
            connection.query(query,[demo.has_demo_given,demo.demo_given_by,demo.demo_date ? dbDateFormate(new Date(demo.demo_date)) : null,demo.has_registered,demo.registered_on ? dbDateFormate(new Date(demo.registered_on)) : null,demo.demo_id], function(err,result){
                connection.release();
                if(!err && result.changedRows) {
                    resolve('success');
                } else {
                    reject(err);
                }        
            });
        });
    });
}

module.exports = {

createDemo : function(req, response){
    createDemo(req.body)
    .then(val =>{
        response.status(200).json({'msg': val});
    })
    .catch(err =>{
        response.status(500).json(err);
    })
},

getListOfDemo : function(req, response){
    getDemos(req.params.status)
    .then(val =>{
        response.status(200).json(val);
    })
    .catch(err =>{
        response.status(500).json(err);
    })
},

updateDemo : function(req, response){
    updateDemo(req.body)
    .then(val =>{
        response.status(200).json(val);
    })
    .catch(err =>{
        response.status(500).json(err);
    })
}

}




