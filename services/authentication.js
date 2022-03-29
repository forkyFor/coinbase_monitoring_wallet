var api_key = "rFzNRWNqkTvKnxWC";
var secret_key = "zB0ur2bjF3ru43LolvAzFPMAfpnIHBwG";

var actualAccounts = [];

var Client = require('coinbase').Client;


module.exports = {
    getClient: function () {
        console.log("return client");
        return new Client({'apiKey': api_key, 
                         'apiSecret': secret_key,
                         'strictSSL': false});
    }
};

/* client.getAccounts({}, function(error, accounts) {

    actualAccounts = accounts.filter(function(x){
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
          console.log('done with', item);
          cb();
        }, 100);
      }
      
      let requests = actualAccounts.reduce((promiseChain, item) => {
          return promiseChain.then(() => new Promise((resolve) => {
            asyncFunction(item, resolve);
          }));
      }, Promise.resolve());
      
      requests.then(() => {
          console.log("number " + actualAccounts.length);
          console.log('done');

            //for(var i =0; i < actualAccounts.length; i++ ){
                client.getAccount(actualAccounts[0].id, function(err, account) {
                //client.getAccount(actualAccounts[i].id, function(err, account) {
                    console.log("*****");
                    account.getTransactions( function(err, txs) {
                        console.log("111");
                        console.log(txs);
                    }); 
                });
            //} 
        })

}); */

/* client.getAddccounts({}, function(error, accounts) {

    actualAccounts = accounts.filter(function(x){
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
        //return x.native_balance.amount !=0.00;
    });


}); */

