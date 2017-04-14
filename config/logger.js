var winston = require('winston');

function dbDateFormate(date) {
   return date.getFullYear() 
   			+ "-" + (date.getMonth() + 1) 
   			+ "-" + date.getDate() 
   			+ " " + date.getHours() 
   			+ ":" + date.getMinutes() 
   			+ ":" + date.getSeconds();
}

var logger = new (winston.Logger)({
	transports: [
	   new (winston.transports.File)({
	   	  filename: './logs/starlly.log',

	      json: false,

	      timestamp: () => {
	        return dbDateFormate(new Date());
	      },
	      
	      formatter: (options) => {
	      	return options.timestamp() 
	        +' '+ options.level.toUpperCase() 
	        +' '+ (options.message ? options.message : '') 
	        + (options.meta && Object.keys(options.meta).length ? '\n'
	        + JSON.stringify(options.meta) : '' );
	      }
	  })
  	]
});
logger.level = 'debug';
module.exports = logger;
