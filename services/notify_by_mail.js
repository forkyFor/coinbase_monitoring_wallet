var nodemailer = require('nodemailer');
const yenv = require('yenv')
const vars = yenv('vars.yaml');

var mail_sent = [];

var transporter = nodemailer.createTransport({
    service: vars.PROVIDER_MAIL_NOTIFY,
    auth: {
      user: vars.MAIL_NOTIFY,
      pass: vars.PWD_MAIL_NOTIFY
    }
  });


var send_mail_async = function(coin){

    if(mail_sent.find(element => element == coin) == undefined){
        var mailOptions = {
            from: vars.MAIL_NOTIFY,
            to: vars.MAIL_DEST_NOTIFY,
            subject: 'Coin ' + coin + ' oltre il ' + vars.PERCENTAGE_THRESHOLD_NOTIFY + ' di guadagno!',
            text: 'That was easy!'
        };  

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                mail_sent.push(coin);
            }
        });
    }
}


async function send_mail(coin) {
    return await send_mail_async(coin);
}

module.exports = {
    send_mail: send_mail
}
    



