var dbutils = require("./userDBUtils.js");
var logger = require('../../../config/logger.js');

function getUserTxnDetails(req, response) {
    dbutils.getUserAndPointInfo(req.params.userid)
    .then(userInfo => {
        return Promise.all([
            dbutils.getUserTxns(userInfo.id),
            Promise.resolve(userInfo),
            dbutils.getUserPointsInfo(userInfo.id)
            ]);
    })
    .then(result =>{
        var out_result = {};
        out_result.available_points = result[1].total_points;
        out_result.current_year_points = result[1].this_year_points;
        out_result.total_reward_points = 0;
        out_result.total_redeem_points = 0;
        out_result.txns = result[0];
        result[2].forEach( p =>{
            if(p.txn_type == 'REDEEM'){
                out_result.total_redeem_points = p.points;
            }else{
                out_result.total_reward_points = p.points;
            }
        })
        response.status(200).json(out_result);
    })
    .catch(err =>{
        response.status(400).json({'status' : err});
    })
}

function getUserReviewDetails(req, response){
    dbutils.getUserInfo(req.params.userid)
    .then(userInfo =>{
        return dbutils.getUserReviews(userInfo.id);
    })
    .then(result =>{
        response.status(200).json(result);
    })
    .catch(err =>{
        response.status(400).json({'status' : err});
    })
}

module.exports = {

    getUserTxnDetails: function(req, response) {
        getUserTxnDetails(req, response);
    },

    getUserReviewDetails : function(req, response){
        getUserReviewDetails(req, response);
    }
}
