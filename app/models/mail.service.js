var nodemailer = require('nodemailer');
var logger = require('../../config/logger.js');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    debug: true,
    auth: {
        user: 'ask@starlly.in',
        pass: '4StarLLy#'
    }
});
function getMyEmailTemplate(mailInfo) {
    switch(mailInfo.type.toUpperCase()){
        case 'VERIFY-EMAIL':
            mailInfo.subject = 'Starlly: Restaurant registration email confirmation mail';
            mailInfo.mailTemplate = "<label>Dear "+mailInfo.restoInfo.contact_person_fname+",</label><br/><p>Thanks for showing interest in StarLLy for "+mailInfo.restoInfo.name+". Please verify your email and sign in to continue the registration process. Thanks for choosing Starlly, we are delighted to be your partner you in achieving your business objectives</p><br><button style='background: #4863A0; height: 40px; width: 90%; color: white; margin: 0 5%;border-radius: 5px;'><a href='"+mailInfo.reqHost+"/pages/verify-email.html?email="+mailInfo.restoInfo.email+"&username="+mailInfo.restoInfo.username+"' target='_blank' style='color: #ffffff'>Verify Email Address</a></button></br><p>The link will expire in 3 days. If link expires please reply to mail without changing the subject and body of the mail</p>";
        break;
        default:
            mailInfo.mailTemplate = "This mail is from StarLLy!."
    }
    return mailInfo;
}
module.exports = {
    sendEMail: function(req, response, mailInfo, callback) {
        logger.info(req.headers['referer']);

        //mailInfo.reqHost = req.headers['referer'] ? req.headers['referer'] : 'https://starlly.in/dev';
        //Code commented and added to handle hostname/... scenarios for multiple sites
        if( req.headers['referer'].indexOf('9000') >= 0  && req.headers['referer'].indexOf('starlly.in')>=0 ){
            //develop/test site
            mailInfo.reqHost = 'https://starlly.in/dev'; 
        }
        else if( req.headers['referer'].indexOf('9001') >= 0 && req.headers['referer'].indexOf('starlly.in')>=0){
            //production home page
           mailInfo.reqHost = 'https://starlly.in/';
        }
         else if( req.headers['referer'].indexOf('9002') >= 0 && req.headers['referer'].indexOf('starlly.in')>=0){
            //production restaurant owner site
           mailInfo.reqHost = 'https://starlly.in/partner';
        }
        else
        {
            //localhost
            mailInfo.reqHost = req.headers['referer'];
        }

       // console.log("mailInfo.reqHost logged: " +mailInfo.reqHost);
        
        var mailInfo = getMyEmailTemplate(mailInfo);
        var mailOptions = {
            from: "ask@starlly.in",
            to: mailInfo.to,
            bcc: 'partner@starlly.in',
            subject: mailInfo.subject,
            html: mailInfo.mailTemplate,
        }
        logger.info(mailOptions);
        transporter.sendMail(mailOptions, function(error, info) {
            logger.info(error)
            if (info) {
                callback({ "code": 200, "info": info });
            } else if (error) {
                callback({ "code": 500, "error": error });
            } else {
                callback({ "code": 400, "info": info });
            }
        });
    }
};