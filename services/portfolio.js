var portfolio = [];

var update_portfolio = function(currency, num_transactions, amount_invested, actual_amount){
    for(var i=0; i < portfolio.length; i++){
        if(portfolio[i].currency == currency){
            portfolio[i].values_live = {};
            portfolio[i].values_live.num_transactions = num_transactions;
            portfolio[i].values_live.amount_invested = amount_invested;
            portfolio[i].values_live.actual_amount = actual_amount;

        }
    }
}

var set_portfolio_async = function(client){
    client.getAccounts({}, function(error, accounts) {

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
            return x.native_balance.amount != "0.00";
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
            account.getTransactions(null, function(err, txs) {
                
                if(txs){
                    for(var i=0; i < txs.length; i++){
                        amount_invested += parseFloat(txs[i].native_amount.amount);
                    }

                    console.log("amount invested " + amount_invested);
                    client_coinbase.getBuyPrice({'currencyPair': account.balance.currency + '-EUR'}, function(err, price) {
                        update_portfolio(account.currency, txs.length, amount_invested, parseFloat(price.data.amount) * parseFloat(account.balance.amount))
                    });
                }
            });

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
    



