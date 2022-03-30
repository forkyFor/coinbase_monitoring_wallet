var Client = require('coinbase').Client;
const yenv = require('yenv')
const vars = yenv('vars.yaml');

module.exports = {
    get_client: function () {
        console.log("return client");
        return new Client({'apiKey': vars.API_KEY, 
                         'apiSecret': vars.SECRET_KEY,
                         'strictSSL': false});
    }
};
