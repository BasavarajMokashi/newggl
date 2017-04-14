var winston = require('winston');
var logger = require('../../config/logger.js');

function getReferralCodes(name) {
    var fDigit = Math.floor(Math.random() * 90000) + 1000;
    return name.slice(0, 2).toUpperCase() + fDigit;
};

function setPropValue(value) {
    return (value || value == 0) ? value : null;
};

module.exports = {

    /************** DB Fields Mapping **************/

    userRegister: function(data) {
        var collection = {}
        collection.fields = ['uid', 'firstname', 'lastname', 'password', 'phone', 'email', 'dob', 'login_type', 'tier',
            'image_url', 'referral_code', 'anniversary_dt', 'gender', 'spouse_name',
            'spouse_dob', 'verified'
        ];

        collection.values = "(unhex(replace(uuid(),'-','')),'" + setPropValue(data.firstname) + "','" + setPropValue(data.lastname) + "','" + setPropValue(data.password) + "','" + setPropValue(data.phone) + "','" + setPropValue(data.email) + "','" + setPropValue(data.dob) + "','" + setPropValue(data.login_type) + "','" + setPropValue(data.tier) + "','" + setPropValue(data.image_url) + "','" + setPropValue(getReferralCodes(data.firstname)) + "','" + setPropValue(data.anniversary_dt) + "','" + setPropValue(data.gender) + "','" + setPropValue(data.spouse_name) + "','" + setPropValue(data.spouse_dob) + "','" + setPropValue(data.verified) + "')";
        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null);
        return collection;
    },
     socNetUserRegister: function(data) {
        var collection = {}
        collection.fields = ['uid', 'firstname', 'lastname', 'password', 'phone', 'email', 'dob', 'login_type', 'tier',
            'image_url', 'referral_code', 'anniversary_dt', 'gender', 'spouse_name',
            'spouse_dob', 'verified','auth_type','profile_id'
        ];

        collection.values = "(unhex(replace(uuid(),'-','')),'" + setPropValue(data.firstname) + "','" + setPropValue(data.lastname) + "','" + setPropValue(data.password) + "','" + setPropValue(data.phone) + "','" + setPropValue(data.email) + "','" + setPropValue(data.dob) + "','" + setPropValue(data.login_type) + "','" + setPropValue(data.tier) + "','" + setPropValue(data.image_url) + "','" + setPropValue(getReferralCodes(data.firstname)) + "','" + setPropValue(data.anniversary_dt) + "','" + setPropValue(data.gender) + "','" + setPropValue(data.spouse_name) + "','" + setPropValue(data.spouse_dob) + "','" + setPropValue(data.verified) + "','" + setPropValue(data.auth_type)+"'," + setPropValue(data.profile_id)+")";
        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null);
        return collection;
    },
    restoRegister: function(data) {
        var collection = {}
        collection.fields = ['rid', 'name', 'username', 'password', 'tab_pin', 'contact_person_fname', 'contact_person_lname', 'phone', 'email', 'lat', 'lng', 'primary_image_url', 'logo_url', 'cost_for_2_people', 'veg_type', 'status','verified'];

        collection.values = "(unhex(replace(uuid(),'-','')),'" 
                                + setPropValue(data.name) 
                                + "','" + setPropValue(data.username) 
                                + "','" + setPropValue(data.password) 
                                + "','" + setPropValue(data.tab_pin) 
                                + "','" + setPropValue(data.contact_person_fname) 
                                + "','" + setPropValue(data.contact_person_lname) 
                                + "','" + setPropValue(data.phone) 
                                + "','" + setPropValue(data.email) 
                                + "','" + setPropValue(data.lat) 
                                + "','" + setPropValue(data.lng) 
                                + "','" + setPropValue(data.primary_image_url) 
                                + "','" + setPropValue(data.logo_url) 
                                + "','" + setPropValue(data.cost_for_2_people) 
                                + "','" + setPropValue(data.veg_type)
                                + "','" + setPropValue('NEW')
                                + "','" + false + "')";
        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null).replace(/'true'/g, true).replace(/'false'/g, false);
        return collection;
    },
    restProfileUpdate: function(data,rest_resultSet) {
        var collection = {}
        collection.fields = ['rid', 'bus_contact_number', 'alt_bus_contact_number', 'website_url', 'facebook_handle', 'twitter_handle', 'description'];

        collection.values = "(" + setPropValue(rest_resultSet[0].rid) 
                                + ",'" + setPropValue(data.bus_contact_number) 
                                + "','" + setPropValue(data.alt_bus_contact_number) 
                                + "','" + setPropValue(data.website_url) 
                                + "','" + setPropValue(data.facebook_handle) 
                                + "','" + setPropValue(data.twitter_handle) 
                                + "','" + setPropValue(data.description) + "')";
        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null).replace(/'true'/g, true).replace(/'false'/g, false);
        return collection;
    },
    restBusHourUpdate:  function(data,rest_resultSet) {
        var collection = {}
        collection.fields = ['rid', 'openning_time', 'closing_time', 'first_sift_start', 'first_sift_end', 'secound_sift_start', 'secound_sift_end', 'third_sift_start', 'third_sift_end', 'closed_on'];

        collection.values = "(" + setPropValue(rest_resultSet[0].rid) 
                                + ",'" + setPropValue(data.openning_time) 
                                + "','" + setPropValue(data.closing_time) 
                                + "','" + setPropValue(data.first_shift_st) 
                                + "','" + setPropValue(data.first_shift_et) 
                                + "','" + setPropValue(data.second_shift_st) 
                                + "','" + setPropValue(data.second_shift_et)
                                + "','" + setPropValue(data.third_shift_st) 
                                + "','" + setPropValue(data.third_shift_et)
                                + "',0b" + setPropValue(data.closed_on) + ")";

        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null).replace(/'true'/g, true).replace(/'false'/g, false);
        return collection;
    },
    cuisionUpdate: function(data,rest_resultSet) {
        var collection = {}
        collection.fields = ['rid','cuision_type'];
        if(data.length > 1){
            collection.values = "";
            for(var i = 0 ; i < data.length ; i++){
                collection.values += "(" + setPropValue(rest_resultSet[0].rid) 
                              + ",'" + setPropValue(data[i]) + "')";
                if(i < data.length-1){
                    collection.values += ",";
                }
            }
        }else{
           collection.values = "(" + setPropValue(rest_resultSet[0].rid) 
                                + ",'" + setPropValue(data[0]) + "')"; 
        }
        return collection;
    },
    serviceUpdate: function(data,rest_resultSet) {
        var collection = {}
        collection.fields = ['rid','service'];
        if(data.length > 1){
            collection.values = "";
            for(var i = 0 ; i < data.length ; i++){
                collection.values += "(" + setPropValue(rest_resultSet[0].rid) 
                              + ",'" + setPropValue(data[i]) + "')";
                if(i < data.length-1){
                    collection.values += ",";
                }
            }
        }else{
           collection.values = "(" + setPropValue(rest_resultSet[0].rid) 
                                + ",'" + setPropValue(data[0]) + "')"; 
        }
        return collection;
    },
    tagUpdate: function(data,rest_resultSet) {
        var collection = {}
        collection.fields = ['rid','tagname'];
        if(data.length > 1){
            collection.values = "";
            for(var i = 0 ; i < data.length ; i++){
                collection.values += "(" + setPropValue(rest_resultSet[0].rid) 
                              + ",'" + setPropValue(data[i]) + "')";
                if(i < data.length-1){
                    collection.values += ",";
                }
            }
        }else{
           collection.values = "(" + setPropValue(rest_resultSet[0].rid) 
                                + ",'" + setPropValue(data[0]) + "')"; 
        }
        return collection;
    },
    imageUpdate: function(data,rest_resultSet) {
        var collection = {}
        collection.fields = ['rid','image_url'];
        if(data.length > 1){
            collection.values = "";
            for(var i = 0 ; i < data.length ; i++){
                collection.values += "(" + setPropValue(rest_resultSet[0].rid) 
                              + ",'" + setPropValue(data[i]) + "')";
                if(i < data.length-1){
                    collection.values += ",";
                }
            }
        }else{
           collection.values = "(" + setPropValue(rest_resultSet[0].rid) 
                                + ",'" + setPropValue(data[0]) + "')"; 
        }
        return collection;
    },

    secondaryImageUpload: function(data,rid) {
        var collection = {}
        collection.fields = ['rid','image_url'];
        if(data.length > 1){
            collection.values = "";
            for(var i = 0 ; i < data.length ; i++){
                collection.values += "(" + setPropValue(rid) 
                              + ",'" + setPropValue(data[i].image_url) + "')";
                if(i < data.length-1){
                    collection.values += ",";
                }
            }
        }else{
           collection.values = "(" + setPropValue(rid) 
                                + ",'" + setPropValue(data[0].image_url) + "')"; 
        }
        return collection;
    },

    addRestAddress: function(data,rid) {
        var collection = {}
        collection.fields = ['rid', 'address1', 'address2', 'city', 'state', 'pin', 'locality'];

        collection.values =     "(" + setPropValue(rid) 
                                + ",'" + setPropValue(data.address1) 
                                + "','" + setPropValue(data.address2) 
                                + "','" + setPropValue(data.city) 
                                + "','" + setPropValue(data.state) 
                                + "','" + setPropValue(data.pin) 
                                + "','" + setPropValue(data.locality) + "')";
        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null).replace(/'true'/g, true).replace(/'false'/g, false);
        return collection;
    },
    submitReview: function(data) {
        var collection = {}
        collection.fields = ['reviewid', 'uid', 'rid', 'variety_rating', 'taste_rating', 'service_rating', 'comment', 'approval_status'];

        collection.values = "(unhex(replace(uuid(),'-','')),'" + setPropValue(data.uid) + "','" + setPropValue(data.rid) + "','" + setPropValue(data.variety_rating) + "','" + setPropValue(data.taste_rating) + "','" + setPropValue(data.service_rating) + "','" + setPropValue(data.comment) + "','" + "New')";
        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null).replace(/'true'/g, true).replace(/'false'/g, false);
        return collection;
    },
    OTPMap: function(data) {
        var collection = {}
        collection.fields = ['uid', 'otp', 'status', 'resent_count'];

        collection.values = "('" + setPropValue(data.uid) + "','" + setPropValue(data.otp) + "','" + setPropValue(data.status) + "','" + setPropValue(data.resent_count) + "')";
        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null).replace(/'true'/g, true).replace(/'false'/g, false);
        return collection;
    },
    userTransaction: function(data) {
        var collection = {}
        collection.fields = ['u_txnid', 'points', 'txn_type', 'referralid', 'invoice_no', 'bill_amount', 'offerid', 'reviewid', 'uid', 'rid', 'bouncebackid', 'claimed_bouncebackid', 'starlly_commision', 'commission_discount_percentage'];

        collection.values = "(unhex(replace(uuid(),'-',''))," + setPropValue(data.points) + ",'" + setPropValue(data.txn_type) + "','" + setPropValue(data.referralid) + "','" + setPropValue(data.invoice_no) + "','" + setPropValue(data.bill_amount) + "','" + setPropValue(data.offerid) + "','" + setPropValue(data.reviewid) + "','" + setPropValue(data.uid) + "','" + setPropValue(data.rid) + "','" + setPropValue(data.bouncebackid) + "','" + setPropValue(data.claimed_bouncebackid) + "'," + setPropValue(data.starlly_commision) + "," + setPropValue(data.commission_discount_percentage) + ")";
        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null).replace(/'true'/g, true).replace(/'false'/g, false);
        return collection;
    },

    userPoints: function(data) {
        var collection = {}
        collection.fields = ['uid', 'total_points', 'this_year_points'];

        collection.values = "('" + setPropValue(data.uid) + "','" + setPropValue(data.total_points) + "','" + setPropValue(data.this_year_points) + "')";
        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null).replace(/'true'/g, true).replace(/'false'/g, false);
        return collection;
    },

    createOffers: function(data) {
        var collection = {}
        collection.fields = ['offerid', 'rid', 'name', 'discount', 'offer_status', 'start_date', 'end_date', 'days', 'start_time', 'end_time'];

        collection.values = "(unhex(replace(uuid(),'-',''))," + setPropValue(data.rid) + ",'" + setPropValue(data.name) + "','" + setPropValue(data.discount) + "','" + setPropValue(data.offer_status) + "','" + setPropValue(data.start_date) + "','" + setPropValue(data.end_date) + "'," + setPropValue('0b' + data.days) + ",'" + setPropValue(data.start_time) + "','" + setPropValue(data.end_time) + "')";
        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null).replace(/'true'/g, true).replace(/'false'/g, false);
        return collection;
    },

    createWaiver: function(data) {
         var collection = {}
        collection.fields = ['commissionid', 'rid', 'incentive', 'is_new_customer_waiver','starlly_discount_on_commission'];

        collection.values = "(unhex(replace(uuid(),'-','')),'" 
                                + setPropValue(data.rid) 
                                + "','" + setPropValue(data.incentive) 
                                + "','" + setPropValue(data.is_new_customer_waiver) 
                                + "','" + setPropValue(data.starlly_discount_on_commission)
                                + "')";
        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null).replace(/'true'/g, true).replace(/'false'/g, false);
        return collection;
    },

    createBounceBackOffers: function(data) {
        var collection = {}
        collection.fields = ['rid', 'bounceback_in_days', 'bounceback_discount', 'start_date', 'end_date', 'active'];

        collection.values = "(" + setPropValue(data.rid) + "," + setPropValue(data.bounceback_in_days) + "," + setPropValue(data.bounceback_discount) + ",'" + setPropValue(data.start_date) + "','" + setPropValue(data.end_date) + "'," + setPropValue(data.active) + ")";
        //Replace if 'null' to null
        collection.values = collection.values.replace(/'null'/g, null).replace(/'true'/g, true).replace(/'false'/g, false);
        return collection;
    },
};
