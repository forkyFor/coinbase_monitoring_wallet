var nodemailer = require('nodemailer');
const yenv = require('yenv')
const vars = yenv('vars.yaml');

var mail_sent = [];

var transporter = nodemailer.createTransport({
    host: vars.PROVIDER_MAIL_NOTIFY,
    auth: {
      user: vars.MAIL_NOTIFY,
      pass: vars.PWD_MAIL_NOTIFY
    }
  });


  //reset mails sent every 5 minutes
setInterval(function() {
    mail_sent = []
}, 60000 * 5);


var send_alert_async = function(coin, percentage, isOver){

    if(mail_sent.find(element => element == coin) == undefined){

        var subject= "";

        if(isOver){
            subject =  'Coin ' + coin + ' over ' + vars.PERCENTAGE_THRESHOLD_OVER_NOTIFY + ' profit!';  
        }else{
            subject =  'Coin ' + coin + ' less ' + vars.PERCENTAGE_THRESHOLD_LESS_NOTIFY + ' profit!';
        }

        var mailOptions = {
            from: vars.MAIL_NOTIFY,
            to: vars.MAIL_DEST_NOTIFY,
            subject: subject,
            text: 'Actual profit: ' + percentage,
            attachments: [
                {
                    filename: 'wallet_report.csv',
                    path: vars.PATH_WALLET_CSV
                },
                {
                    filename: 'wallet_report.xlsx',
                    path: vars.PATH_WALLET_XLSX
                }
            ]
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

var send_mail_report_async = function(){

    var mailOptions = {
        from: vars.MAIL_NOTIFY,
        to: vars.MAIL_DEST_NOTIFY,
        subject: 'Report wallet coinbase',
        attachments: [
            {
                filename: 'wallet_report.csv',
                path: vars.PATH_WALLET_CSV
            },
            {
                filename: 'wallet_report.xlsx',
                path: vars.PATH_WALLET_XLSX
            }
        ]
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


async function send_alert(coin, percentage) {
    return await send_alert_async(coin, percentage);
}

async function send_mail_transaction(from_currency, to_currency, amount_sent, err, txt) {
    return await send_mail_transaction_async(from_currency, to_currency, amount_sent, err, txt);
}

async function send_mail_report() {
    return await send_mail_report_async();
}

module.exports = {
    send_alert: send_alert,
    send_mail_transaction: send_mail_transaction,
    send_mail_report: send_mail_report
}
    



