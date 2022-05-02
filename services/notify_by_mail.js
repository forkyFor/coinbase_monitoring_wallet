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


  //reset mails sent every 5 minutes
setInterval(function() {
    mail_sent = []
}, 60000 * 5);


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

var send_mail_transaction_async = function(from_currency, to_currency, amount_sent, err, txt){

    var mailOptions = {
        from: vars.MAIL_NOTIFY,
        to: vars.MAIL_DEST_NOTIFY,
        subject: 'Transaction from  ' + from_currency + ' to ' + to_currency + '. Amount : ' + amount_sent,
        text: 'txt: \n ' + txt + "\n\n\n" + "err: \n" + err
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


async function send_mail(coin) {
    return await send_mail_async(coin);
}

async function send_mail_transaction(from_currency, to_currency, amount_sent, err, txt) {
    return await send_mail_transaction_async(from_currency, to_currency, amount_sent, err, txt);
}

module.exports = {
    send_mail: send_mail,
    send_mail_transaction: send_mail_transaction
}
    



