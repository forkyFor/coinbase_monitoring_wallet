var portfolio = [];
var mail_manage = require('./notify_by_mail');
const yenv = require('yenv')
const vars = yenv('vars.yaml');



// function to calculate Exponential Moving Average
var getEMA = (a,r) => a.reduce((p,n,i) => i ? p.concat(2*n/(r+1) + p[p.length-1]*(r-1)/(r+1)) : p, [a[0]]);


 

// values updated and sent at csv file
var update_portfolio = function(currency, num_transactions, amount_invested, actual_amount, percDiff, average_price_for_money, actual_price_coin, exponential_moving_average, perc_exponential_moving_average){
    for(var i=0; i < portfolio.length; i++){
        if(portfolio[i].currency == currency){
            if(actual_amount > 0){
                portfolio[i].values_live = {};
                portfolio[i].values_live.num_transactions = num_transactions.toString();
                portfolio[i].values_live.amount_invested = amount_invested.toString().replace('.', ',');
                portfolio[i].values_live.actual_amount = actual_amount.toString().replace('.', ',');
                portfolio[i].values_live.percentage_difference = percDiff.toString().replace('.', ',');
                portfolio[i].values_live.average_price_for_money = average_price_for_money.toString().replace('.', ',');
                portfolio[i].values_live.actual_price_coin = actual_price_coin.toString().replace('.', ',');
                portfolio[i].values_live.exponential_moving_average = exponential_moving_average.toString().replace('.', ',');
                portfolio[i].values_live.percentage_exponential_moving_average = perc_exponential_moving_average.toString().replace('.', ',');
            }else{
                portfolio.splice(i, 1);
            }
        }
    }

}

var set_portfolio_async = function(client){
    client.getAccounts({limit: 100}, function(error, accounts) {


        portfolio = accounts.filter(function(x){
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
        
        let requests = portfolio.reduce((promiseChain, item) => {
            return promiseChain.then(() => new Promise((resolve) => {
                asyncFunction(item, resolve);
            }));
        }, Promise.resolve());
        
        
        requests.then(() => {
        })

    }); 
}

var add_amount_transcations_async = function(client_coinbase){

    for(var i=0; i < portfolio.length; i++){


        client_coinbase.getAccount(portfolio[i].id, function(err, account) {
            var amount_invested = 0;

            // sum of token bought to calculate the average price
            var token_bought = 0;

            // variabile per tenere tutti i prezzi per moneta d'acquisto. Utilizzata successivamente per il calcolo media mobile esponenziale
            var prices_for_money = [];


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
                            prices_for_money.push(parseFloat(txs[i].native_amount.amount) / parseFloat(txs[i].amount.amount));

                            if(amount_invested < 0){
                                //restart counts because for that portfolio was sell all portfolio in old transactions
                                amount_invested =0;
                                token_bought =0;
                                prices_for_money = [];
                            }
                        }

                        

                        //add average price 
                        var average_price_for_money = {};
                        average_price_for_money = amount_invested / token_bought;

                        var actual_price_coin = parseFloat(account.native_balance.amount) / parseFloat(account.balance.amount)



                        //calculate percentage
                        if( average_price_for_money <= 0)
                            var percDiff =  parseFloat(( actual_price_coin - 1) * 100).toFixed(2);
                        else
                            var percDiff =  parseFloat(( (actual_price_coin / average_price_for_money) - 1) * 100).toFixed(4);
                    


                        // calculate Exponential Moving Average
                        var exponential_moving_average = getEMA(prices_for_money,vars.PARAM_EXPONENTIAL_AVERAGE_CALCULATE);


                        //calculate percentage than Exponential Moving Average 
                        var perc_exponential_moving_average =  parseFloat(( (actual_price_coin / exponential_moving_average[[exponential_moving_average.length -1]]) - 1) * 100).toFixed(4);
                    


                        if(vars.BOOL_MAIL_NOTIFY){
                            //verify if percentage is over the threshold
                            if(percDiff > parseFloat(vars.PERCENTAGE_THRESHOLD_NOTIFY)){
                                
                                mail_manage.send_mail(account.currency);
                            }
                        }
                        
                        update_portfolio(account.currency, txs.length, amount_invested, parseFloat(account.native_balance.amount), percDiff, average_price_for_money, actual_price_coin, exponential_moving_average[exponential_moving_average.length -1], perc_exponential_moving_average);
                    }
                });
            }
        });
    }
}

async function set_portfolio(client) {
    return await set_portfolio_async(client);
}

async function add_amount_transcations(client_coinbase) {
    return await add_amount_transcations_async(client_coinbase);
}

module.exports = {
    get_portfolio: function () {
        return portfolio;
    },
    set_portfolio: set_portfolio,
    add_amount_transcations: add_amount_transcations
}
    



