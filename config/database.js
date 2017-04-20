module.exports = {
    remote : {
    	connectionLimit : 100, //important
	    host	 : '104.197.182.19', // Production.
	  	user     : 'root',
	  	password : 'root',
	  	database : 'ggldb',
	  	debug	 : false
	},
    localhost : {
    	connectionLimit : 100, //important
	  	host     : '127.0.0.1',//localhost
	  	user     : 'root',
	  	password : '',
	  	database : 'ggldb',
	  	//debug	 : false
	}
};



