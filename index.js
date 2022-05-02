var auth = require('./services/authentication');
var portfolio_manage = require('./services/portfolio');
var csv_management = require('./services/csv_management');
var mail_management = require('./services/notify_by_mail');
const yenv = require('yenv')
const vars = yenv('vars.yaml');

console.log("start app");
var client_coinbase = auth.get_client();

console.log("authenticated");
portfolio_manage.set_portfolio(client_coinbase);
 

setInterval(function() {
    if(portfolio_manage.get_portfolio().length !== 0) {

        console.log("portfolio received");
        console.log("update values amount");
        portfolio_manage.add_amount_transcations(client_coinbase);
    }
}, 10000);

if(vars.BOOL_WRITE_CSV){
    setInterval(function() {
        csv_management.write_csv(portfolio_manage.get_portfolio());
    }, 30000 );
}


//send report all portfolio
if(vars.BOOL_REPORT_CSV){
    setInterval(function() {
        mail_management.send_mail_report();
    }, 60000  * 60 * 3);
}