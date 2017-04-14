//Custome Dependency Modules
var database = require(__dirname + "/../database.js");
var logger = require('../../../config/logger.js');

function getRestaurant(filter){
    return new Promise(function(resolve,reject){

            var currentDate, currentTime, dateRange, activeOfferQuery, dayInBinary = '0b';
            for (var i = 1; i <= 7; i++) {
                if (i === new Date().getDay() || (i === 7 && new Date().getDay() === 0)) { dayInBinary += '1' } else { dayInBinary += '0' }
            }
            currentDate = new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();
            currentTime = (new Date().getHours() < 10 ? '0' : '') + new Date().getHours() + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes();
            dateRange = "(STR_TO_DATE(start_date,'%Y-%m-%d') <= STR_TO_DATE('" + currentDate + "','%Y-%m-%d') && STR_TO_DATE('" + currentDate + "','%Y-%m-%d') <= STR_TO_DATE(end_date,'%Y-%m-%d'))";
            timeRange = "( start_time <= " + currentTime + " && " + currentTime + " <= end_time )";
            activeOfferQuery = "SELECT rid,discount FROM offer WHERE (offer_status = 'LIVE'  AND days & " + dayInBinary + " AND " + dateRange + " AND " + timeRange + ") ORDER BY created_date DESC";
            database.getDBConnectionForGroupBy(connection => {
                
                var query = `SELECT HEX(rest.rid) AS rid,rest.name,rest.phone AS contact_person_number,rest.cost_for_2_people,rest.veg_type,rest.lat,rest.lng,rest.primary_image_url,rest.logo_url,
                                address.address1,address.address2,address.city,address.state,address.pin,address.locality,
                                profile.bus_contact_number,profile.alt_bus_contact_number,profile.website_url,profile.facebook_handle,profile.twitter_handle,profile.description,
                                rat.user_count,rat.overall_rating,offer.discount,
                                buss_hour.openning_time,buss_hour.closing_time,buss_hour.first_sift_start,buss_hour.first_sift_end,
                                buss_hour.secound_sift_start,buss_hour.secound_sift_end,buss_hour.third_sift_start,buss_hour.third_sift_end,BIN(buss_hour.closed_on) AS closed_on,
                                GROUP_CONCAT(
                                  DISTINCT CONCAT(ser.service)
                                  SEPARATOR '::'
                                ) AS services,
                                GROUP_CONCAT(
                                  DISTINCT CONCAT(cuisine.cuision_type)
                                  SEPARATOR '::'
                                ) AS cuisines
                                FROM restaurant rest
                                LEFT JOIN restaurant_address address
                                ON rest.id = address.rid
                                LEFT JOIN (ACTIVEOFFERQUERYSTRING) as offer
                                ON rest.id = offer.rid
                                LEFT JOIN business_hour buss_hour
                                ON rest.id = buss_hour.rid
                                LEFT JOIN restaurant_profile profile
                                ON rest.id = profile.rid
                                LEFT JOIN rating_summary rat
                                ON rest.id = rat.rid
                                LEFT JOIN restaurant_has_service ser
                                ON rest.id = ser.rid
                                LEFT JOIN restaurant_has_cuisine cuisine
                                ON rest.id = cuisine.rid
                                WHERE rest.verified = true  AND rest.status = 'LIVE' GROUP BY rest.rid ORDER BY rest.created_date DESC`
                
                query = query.replace('ACTIVEOFFERQUERYSTRING',activeOfferQuery);
                connection.query(query,[], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            resolve(rows);
                        }else{
                            resolve([]);
                        }
                    } else {
                        reject(err);
                    }        
                });
            });
        });
}

function getRestaurantImages(rid){
    return new Promise(function(resolve,reject){
         database.getDBConnection(connection => {
            var query = "SELECT `image_url` FROM `restaurant_image` WHERE `rid`= ?";
            connection.query(query,[rid], function(err,rows){
                connection.release();
                if(!err) {
                    if(rows.length > 0){
                        resolve(rows);
                    }else{
                        resolve([]);
                    }
                } else {
                    reject(err);
                }        
            });
        });
    });
}

function getRestaurantReviews(rid){
    return new Promise((resolve, reject) =>{
        database.getDBConnection(connection =>{
            var query = `SELECT HEX(r.reviewid) AS reviewid,CONCAT(u.firstname, ' ' , u.lastname) AS name,u.image_url,
                            ROUND((r.variety_rating + r.taste_rating + r.service_rating)/3,1) as rating,r.comment 
                            FROM user u,review r WHERE r.rid = ? AND r.uid = u.id AND r.comment <> '' ORDER BY rating DESC LIMIT 3`;
            connection.query(query,[rid], function(err,rows){
                connection.release();
                if(!err) {
                    if(rows.length > 0){
                        resolve(rows);
                    }else{
                        resolve([]);
                    }
                } else {
                    reject(err);
                }        
            });
        });
    });
}


module.exports = {
    
    getResturants : function(filter){
        return getRestaurant(filter);
    },

    getRestaurantImages : function(rid){
        return getRestaurantImages(rid);
    },

    getRestaurantReviews : function(rid){
        return getRestaurantReviews(rid);
    }

}
