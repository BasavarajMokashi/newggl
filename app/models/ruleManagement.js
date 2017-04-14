//Custome Dependency Modules
var database = require("./database.js");
var logger = require('../../config/logger.js');

var updateRule = function(ruleInfo){
    return new Promise(function(resolve,reject){
        var query = "UPDATE `rules` SET `value` = ? WHERE `name` = ?";
        database.getDBConnection( conn =>{
            conn.query(query,[ruleInfo.value,ruleInfo.name],function(err, result){
                if(!err){
                    resolve('Rule updated successfully.');
                }else{
                    reject('Invalid Rule!!');
                }
            })
        })
    });
}

module.exports = {

    updateNewUserBonus : function(req, response) {
        var rule = {'name' : 'STARLLY_NEW_USER_BONUS_POINT','value' : req.params.value};
        updateRule(rule)
        .then(info =>{
            logger.info(" STARLLY_NEW_USER_BONUS_POINT is updated with " + req.params.value);
            response.status(200).json({'status' : info});
        }) 
        .catch(err =>{
            response.status(400).json({'status' : err});
        }) 
    },
    updateStarllyDefaultOffer : function(req, response){
        var rule = {'name' : 'STARLLY_DEFAULT_OFFER','value' : req.params.value};
        updateRule(rule)
        .then(info =>{
            logger.info(" STARLLY_DEFAULT_OFFER is updated with " + req.params.value);
            response.status(200).json({'status' : info});
        }) 
        .catch(err =>{
            response.status(400).json({'status' : err});
        })
    }
}
