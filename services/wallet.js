var wallet = [];
var mail_manage = require('./notify_by_mail');
const yenv = require('yenv')
const vars = yenv('vars.yaml');
var transacting = false;


 

// values updated and sent at csv file
var update_wallet = function(currency, num_transactions, amount_invested, actual_amount, percDiff, average_price_for_money, actual_price_coin){
    for(var i=0; i < wallet.length; i++){
        if(wallet[i].currency == currency){
            if(actual_amount > 0){
                wallet[i].values_live = {};
                wallet[i].values_live.num_transactions = num_transactions.toString();
                wallet[i].values_live.amount_invested = amount_invested.toString().replace('.', ',');
                wallet[i].values_live.actual_amount = actual_amount.toString().replace('.', ',');
                wallet[i].values_live.average_price_for_money = average_price_for_money.toString().replace('.', ',');
                wallet[i].values_live.actual_price_coin = actual_price_coin.toString().replace('.', ',');
                wallet[i].values_live.percentage_difference = percDiff.toString().replace('.', ',');
            }else{
                wallet.splice(i, 1);
            }
        }
    }

}

//verify if all accounts have the values_live associated
function verifyValueSLive(){
    var verify = true;

    for(var i=0; i < wallet.length; i++){
        if(wallet[i].values_live == undefined)
        verify=false;
    }
    return verify;
}


//function to trasfer money at the last account with minus percDiff in array
function transferMoney(account){

    if(verifyValueSLive()){
        wallet.sort(function (a, b) {
            var percentageA = parseFloat(a.values_live.percentage_difference), percentageB = parseFloat(b.values_live.percentage_difference)
            return percentageA - percentageB
        });

        //calculate how many amount send it
        var amount_sent = (parseFloat(account.balance.amount) * parseFloat(vars.PERCENTAGE_THRESHOLD_NOTIFY)) / 100;

        if(!transacting){
            transacting = true;
            account.transferMoney({'to': wallet[0].id.toString(),
                                    'currency': account.currency,
                                    'amount': amount_sent.toString().replace(".", ",")}, 
            function(err, tx) {   
                transacting = false;
                if(vars.BOOL_MAIL_NOTIFY_TRANSACTION){
                    mail_manage.send_mail_transaction(account.currency, wallet[0].currency, amount_sent, err, tx); 
                }
            });
        }
    }


}

var set_wallet_async = function(client){
    client.getAccounts({limit: 100}, function(error, accounts) {


        wallet = accounts.filter(function(x){
            delete x.client;
            delete x.primary;
            delete x.type;
            delete x.name;
            delete x.created_at;
            delete x.updated_at;
            delete x.resource;
            delete x.allow_deposits;
            delete x.allow_withdrawals;
            return x;
            //return x.native_balance.amount != "0.00";
        }, ); 

        function asyncFunction (item, cb) {
            setTimeout(() => {
                cb();
            }, 100);
        }
        
        let requests = wallet.reduce((promiseChain, item) => {
            return promiseChain.then(() => new Promise((resolve) => {
                asyncFunction(item, resolve);
            }));
        }, Promise.resolve());
        
        
        requests.then(() => {
        })

    }); 
}

var add_amount_transcations_async = function(client_coinbase){

    for(var i=0; i < wallet.length; i++){


        client_coinbase.getAccount(wallet[i].id, function(err, account) {
            var amount_invested = 0;

            // sum of token bought to calculate the average price
            var token_bought = 0;


            if(account){
                account.getTransactions({limit:100}, function(err, txs) {
                    
                    if(txs){

                        //sort transactions for date
                        txs.sort(function (a, b) {
                            var dateA = new Date(a.created_at), dateB = new Date(b.created_at)
                            return dateA - dateB
                        });

                        for(var i=0; i < txs.length; i++){

                            amount_invested += parseFloat(txs[i].native_amount.amount);
                            token_bought += parseFloat(txs[i].amount.amount);
                            
                            if(amount_invested < 0){
                                //restart counts because for that wallet was sell all wallet in old transactions
                                amount_invested =0;
                                token_bought =0;
                            }
                        }

                        

                        //add average price 
                        var average_price_for_money = {};
                        average_price_for_money = amount_invested / token_bought;

                        var actual_price_coin = parseFloat(account.native_balance.amount) / parseFloat(account.balance.amount)



                        //calculate percentage
                        var percDiff =  parseFloat(( (actual_price_coin / average_price_for_money) - 1) * 100).toFixed(4);
                    



                        if(vars.BOOL_MAIL_NOTIFY){
                            //verify if percentage is over the threshold
                            if(percDiff > parseFloat(vars.PERCENTAGE_THRESHOLD_NOTIFY)){
                                //start transactions
                                mail_manage.send_mail(account.currency);                                
                            }
                        }

                        if(vars.BOOL_AUTOMATIC_TRANSFER){
                            //verify if percentage is over the threshold
                            if(percDiff > parseFloat(vars.PERCENTAGE_THRESHOLD_NOTIFY)){
                                //start transactions
                                transferMoney(account);
                            }
                        }

                        update_wallet(account.currency, txs.length, amount_invested, parseFloat(account.native_balance.amount), percDiff, average_price_for_money, actual_price_coin);
                    }
                });
            }
        });
    }
}

async function set_wallet(client) {
    return await set_wallet_async(client);
}

async function add_amount_transcations(client_coinbase) {
    return await add_amount_transcations_async(client_coinbase);
}

module.exports = {
    get_wallet: function () {
        return wallet;
    },
    set_wallet: set_wallet,
    add_amount_transcations: add_amount_transcations
}
    



