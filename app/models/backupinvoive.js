fonts = {
        Roboto: {
            normal: './fonts/Roboto-Regular.ttf',
            bold: './fonts/Roboto-Medium.ttf',
            italics: './fonts/Roboto-Italic.ttf',
            bolditalics: './fonts/Roboto-Italic.ttf'
        }
    };

var PdfPrinter = require('pdfmake/src/printer');
var printer = new PdfPrinter(fonts);
var fs  = require('fs');
var database = require("./database.js");
var dbFieldsMapping = require("./mapping.js");
var AppConstants = require(__dirname + "/common/constants.js");
var myPromise = require(__dirname + "/dbOperationUtils.js");
var logger = require('../../config/logger.js');
var eMail = require("./mail.service.js");
var mysql = require('mysql');
var _ = require('lodash');
var cron = require('node-cron');




return new Promise(function(resolve,reject){
	//cron.schedule('* * * * *', function(){
database.getDBConnection(connection => {
var getRestaurantQuery="SELECT id as getRestaurantId FROM restaurant ORDER BY id desc";
connection.query(getRestaurantQuery, function(err,restrows){
connection.release();
if(!err) {
if(restrows.length > 0){
for(var r in restrows){

}
}
}	
});	
	
var invoiceQuery="SELECT rid as invoicetxnId,id as invoiceId,fromdate as invoiceFromdate, "+
"todate as invoiceTodate,totalamount as invoiceTotalamount,payment_status as PaymentStatus, "+
"balance as invoiceBalance,carried_balance as carriedBalance,created_date as invoiceCreatedDate "+
"FROM invoice ";
connection.query(invoiceQuery, function(err,invoicerows){
if(!err) {
if(invoicerows.length > 0){
for(var i in invoicerows){	
var invoiceTxnid  = invoicerows[i].invoicetxnId;
var dateRange = {};
var start = invoicerows[i].invoiceCreatedDate;
var dueDate='2017-01-27 00:00:00';
var paymentStatus ='1';
var paymentBal ='2000';
var carried_balance="10000";
var end = new Date();
end.setDate(start.getDate() + 7);
dateRange.end = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + " 00:00:00";
dateRange.start = end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " 00:00:00";
var reportQuery = "SELECT t.created_date as dateTime, t.id as txnId, u.phone as customerId, t.invoice_no as invoiceNo," + 
"t.bill_amount as invoiceAmount, t.txn_type as txnType, t.points as points, t.starlly_commision as starllyCommision, "+
"t.commission_discount_percentage as commissionDiscountPercentage, o.discount as offerPercentage, "+
"rest.id as restaurantId,rest.contact_person_fname as firstname,rest.contact_person_lname as lastname,rest.name as restaurantname ,"+
"r.value as defaultOfferPercentage, bb_o.bounceback_discount as bounceBackDiscount, "+
"radd.address1 as restaurantAddress1, radd.address2 as restaurantAddress2,radd.city as restaurantCity, "+
"radd.state as restaurantState,radd.pin as restaurantPincode,radd.locality as restaurantLocality, "+
"IFNULL((select 'N' as isnew from starlly_t.user_txn as ttt where ttt.rid=t.rid " +
"AND ttt.txn_type='REWARD' and ttt.uid = t.uid having created_date = min(created_date)), 'Y') as isrepeat "+
"FROM user_txn AS t LEFT JOIN user AS u ON t.uid = u.id "+
"LEFT JOIN offer AS o ON t.offerid = o.offerid "+
"LEFT JOIN rules AS r ON r.name = 'STARLLY_DEFAULT_OFFER' "+
"LEFT JOIN bounceback_offer AS bb_o ON t.claimed_bouncebackid = bb_o.bouncebackid "+
"LEFT JOIN restaurant AS rest ON t.rid = rest.id "+
"LEFT JOIN restaurant_address AS radd ON t.rid = radd.rid "+
"WHERE t.rid = "+invoiceTxnid+" AND t.txn_type != 'BONUS' ";
//"AND STR_TO_DATE('"+dateRange.end+"','%Y-%m-%d') <= STR_TO_DATE(t.created_date,'%Y-%m-%d') "+
//"AND STR_TO_DATE('"+dateRange.start+"','%Y-%m-%d') >= STR_TO_DATE(t.created_date,'%Y-%m-%d') "+
//"ORDER BY t.created_date DESC";
                   
connection.query(reportQuery, function(err,rows){
if(!err) {
if(rows.length > 0){
	var uniqueRecordSet = _.uniqBy(rows, 'invoiceNo');
	var recordSet  = _.groupBy(rows, 'invoiceNo');
	var resultSet  = {};
	resultSet.data = [];
	var invoiceAmountTotal=0;
	var redemptionAmtTotal=0;
	var rewardAmtTotal=0;
	var bounceBackAmtTotal=0;
	var starllyCommisionTotal=0;
	var totalAmtTotal=0;
	var netAmtTotal=0;
	for(var i = 0; i < uniqueRecordSet.length; i++){
		var redeemRecord = _.filter(recordSet[uniqueRecordSet[i].invoiceNo], { 'txnType': 'REDEEM' })[0];
		var rewardRecord = _.filter(recordSet[uniqueRecordSet[i].invoiceNo], { 'txnType': 'REWARD' })[0];
		var rowRecord = rewardRecord ? rewardRecord : redeemRecord;
		rowRecord.repeat = rowRecord.isrepeat;
		rowRecord.bounceBackAmt = (rowRecord.invoiceAmount - (redeemRecord && redeemRecord.points ? redeemRecord.points : 0)) * ((rewardRecord.bounceBackDiscount ? rewardRecord.bounceBackDiscount : 0)/100);
		rowRecord.redemptionAmt = redeemRecord && redeemRecord.points ? redeemRecord.points : 0;
		rowRecord.rewardAmt = rewardRecord.points - rowRecord.bounceBackAmt;
		rowRecord.totalAmt = rowRecord.rewardAmt + rowRecord.bounceBackAmt + rewardRecord.starllyCommision;
		rowRecord.netAmt = rowRecord.totalAmt - rowRecord.redemptionAmt;
		rowRecord.customerId = rowRecord.customerId.replace(rowRecord.customerId.substring(2,7), 'XXXXX');
		invoiceAmountTotal += rowRecord.invoiceAmount;
		redemptionAmtTotal += rowRecord.redemptionAmt;
		rewardAmtTotal += rowRecord.rewardAmt;
		bounceBackAmtTotal += rowRecord.bounceBackAmt;
		starllyCommisionTotal += rowRecord.starllyCommision;
		var ResuaurantName = rowRecord.restaurantname;
		var FirstName      = rowRecord.firstname;
		var LastName       = rowRecord.lastname;
		var Address1       = rowRecord.restaurantAddress1;
		var Address2       = rowRecord.restaurantAddress2;
		var State          = rowRecord.restaurantState;
		var City           = rowRecord.restaurantCity;
		var Pincode        = rowRecord.restaurantPincode;
		var locality       = rowRecord.restaurantLocality;
		var BillNumber     = rowRecord.txnId;
		var RestaurantId   = rowRecord.restaurantId;
		totalAmtTotal += rowRecord.totalAmt;
		netAmtTotal += rowRecord.netAmt;
		resultSet.data.push(rowRecord);
		
	}
	resultSet.count = resultSet.data.length;
	var externalDataRetrievedFromServer=[];
    for(var j=0;j<resultSet.count;j++){
	   externalDataRetrievedFromServer.push({
	   DateTime:resultSet.data[j].dateTime,
	   TxnID:resultSet.data[j].txnId,
	   CustID:resultSet.data[j].customerId,
	   Invoice:resultSet.data[j].invoiceNo,
	   InvoiceAmount:resultSet.data[j].invoiceAmount,
	   RedemptionAmout:resultSet.data[j].redemptionAmt,
	   Repeat:resultSet.data[j].isrepeat,
	   CustRewardAmuount:resultSet.data[j].rewardAmt,
	   BounceBackAmount:resultSet.data[j].bounceBackAmt,
	   StarllyFee:resultSet.data[j].starllyCommision,
	   TotalFee:resultSet.data[j].totalAmt,
	   Nett:resultSet.data[j].netAmt,
});
}

									
function buildTableBody(data, columns) {
	var body = [];
    body.push(columns);
    data.forEach(function(row) {
    var dataRow = [];
    columns.forEach(function(column) {
			dataRow.push(row[column].toString());
	})
    body.push(dataRow);
	});
	body.push([ '', '', '', '',invoiceAmountTotal,
    redemptionAmtTotal,'',rewardAmtTotal,bounceBackAmtTotal,
    starllyCommisionTotal,totalAmtTotal,netAmtTotal]);
    return body;
}
         
function table(data, columns) {
	return {
		table: {
			headerRows: 1,
			body: buildTableBody(data, columns)
		}
	};
}
function tablenew(data, columns) {
	var test ='Mr/Ms ' +FirstName +' '+LastName+'<br>'+Address1 +' '+Address2;
		return {
			style: 'tableExample',
			table: {
				widths: [500, 405],
			body: [
			 [{ text:'Mr/Ms ' +FirstName +' '+LastName+','+'\n'+Address1 +' '+Address2 +','+'\n'+State +' '+City+','+'\n'+locality +' '+Pincode,fontSize:15,bold: true}, 
			 'Account Summary:\nLast Bill Amount:6000.00\nPayments:cash\nCustomer rewards this period(A):'
			 +rewardAmtTotal+
			 '\nStarlly commission(C):'
			 +starllyCommisionTotal+'\nTotal charges this period:'+totalAmtTotal+'\nRedemptions:'
			 +redemptionAmtTotal+
			 '\nNet charges:'+netAmtTotal+'\nBill No:'+RestaurantId+'\nNet charges:'+netAmtTotal+
			 '\nBill No:'+RestaurantId+'\n'],
			 
			]
		   }
		};
}
        var billperiod    ="Bill Period:27-1-2017 | 05-2-2017";
		var InvoiceNumber = Math.floor(1000 + Math.random() * 9000);
		var docDefinition  = {
			 pageSize: 'LEGAL',
             pageOrientation: 'landscape',
             pageMargins: [40, 80, 40, 60],
			content: [
			    tablenew(),
				table(externalDataRetrievedFromServer, ['DateTime', 'TxnID',
				'CustID','Invoice','InvoiceAmount','RedemptionAmout','Repeat',
				'CustRewardAmuount','BounceBackAmount','StarllyFee','TotalFee','Nett']),
				],
				
	styles: {
      restnamestyle: {
		 fontSize:12
      },
     anotherStyle: {
       italic: true,
       alignment: 'right'
     },
	tableExample: {
	   margin: [0, 5, 0, 15]
	  },
  anotherStyle: {
   italic: true,
   alignment: 'right'
   }
 }
		
}							
pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('invoice/Invoice'+InvoiceNumber+'.pdf')).on('finish',function(){
});
pdfDoc.end();
 var query = "INSERT INTO `invoice` (`rid`,`fromdate`,`todate`,`due_date`,`totalamount`,`starry_commision`, "+
 "`customer_rewardpoint`,`redemptionamount`,`bouncebackamount`,`totalfees`,`netamount`,`invoiceno`, "+
 "`payment_status`,`balance`,`carried_balance`,`last_transid`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
 connection.query(query,[RestaurantId,end,start,dueDate,totalAmtTotal,starllyCommisionTotal,rewardAmtTotal,
 redemptionAmtTotal,bounceBackAmtTotal,invoiceAmountTotal,netAmtTotal,RestaurantId,paymentStatus,paymentBal,
 carried_balance,BillNumber], function(err,resultSet){
                //connection.release();
if(!err && resultSet.insertId > 0) {
	resolve('success');
} else {
	reject(err);
}     
});
							  
}				
}       
});
}
}
}
});
});   
//});
});



