var auth = require('./services/authentication');
var wallet_manage = require('./services/wallet');
var csv_management = require('./services/csv_management');
var mail_management = require('./services/notify_by_mail');
const yenv = require('yenv')
const vars = yenv('vars.yaml');

console.log("start app");
var client_coinbase = auth.get_client();

console.log("authenticated");
wallet_manage.set_wallet(client_coinbase);
 

setInterval(function() {
    if(wallet_manage.get_wallet().length !== 0) {

        console.log("wallet received");
        console.log("update values amount");
        wallet_manage.add_amount_transcations(client_coinbase);
    }
}, parseFloat(vars.INTERVAL_SECONDS_UPDATE_WALLET) * 1000);

if(vars.BOOL_WRITE_CSV){
    setInterval(function() {
        csv_management.write_csv(wallet_manage.get_wallet());
    }, parseFloat(vars.INTERVAL_SECONDS_WRITE_CSV) * 1000 );
}


//send report all wallet
if(vars.BOOL_REPORT_CSV){
    setInterval(function() {
        mail_management.send_mail_report();
    }, 60000  * parseFloat(vars.INTERVAL_MINUTES_SEND_CSV_BY_MAIL));
}