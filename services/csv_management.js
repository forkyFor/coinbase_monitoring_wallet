var csvwriter = require('csv-writer');
const yenv = require('yenv')
const vars = yenv('vars.yaml');


function write_csv_async(wallet){

    try{
        var createCsvWriter = csvwriter.createObjectCsvWriter

        var keys = []
        if(wallet[0])
            keys = Object.keys(wallet[0].values_live);

        var header = [];
        header[0] = {id: 'currency', title: 'CURRENCY'}
        for(var i =0; i < keys.length; i++){
            header[i+1] = {id: keys[i], title: keys[i].toUpperCase().replace("_", " ") }
        }
    
        // Passing the column names into the module
        const csvWriter = createCsvWriter({
            // Output csv file name is geek_data
            path: vars.PATH_WALLET_CSV,
            header: header,
            fieldDelimiter: ';'
        });

        var results = [];

        for(var i=0; i < wallet.length; i++){
            results[i] = {};
            results[i].currency= wallet[i].currency
            
            try{
                for(var y=0; y < keys.length; y++){
                    
                    try{
                        if(wallet[i].values_live[keys[y]])
                            results[i][keys[y]] = wallet[i].values_live[keys[y]].toString();
                    }catch(error){
                        console.log(error);
                    }
                }
            }catch(error){
                console.log(error);
            }
        }


        csvWriter
        .writeRecords(results)
        .then(()=> console.log('Data uploaded into csv successfully'))
        .catch((error)=> console.log('Error ' + error));

    }catch(error){
        console.log(error);
    }
}

module.exports = {
    write_csv: function (wallet) {
        write_csv_async(wallet);
    }
};
