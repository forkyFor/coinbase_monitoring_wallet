var csvwriter = require('csv-writer');


function write_csv_async(portfolio){

    var createCsvWriter = csvwriter.createObjectCsvWriter

    var keys = []
    if(portfolio[0])
        keys = Object.keys(portfolio[0].values_live);

    var header = [];
    header[0] = {id: 'currency', title: 'CURRENCY'}
    for(var i =0; i < keys.length; i++){
        header[i+1] = {id: keys[i], title: keys[i].toUpperCase().replace("_", " ") }
    }
  
    // Passing the column names into the module
    const csvWriter = createCsvWriter({
        // Output csv file name is geek_data
        path: 'portfolio.csv',
        header: header,
        fieldDelimiter: ';'
    });

    var results = [];

    for(var i=0; i < portfolio.length; i++){
        results[i] = {};
        results[i].currency= portfolio[i].currency
        for(var y=0; y < keys.length; y++){
            try{
                if(portfolio[i].values_live[keys[y]])
                results[i][keys[y]] = portfolio[i].values_live[keys[y]].toString();
            }catch(error){
                console.log(error);
            }
        }
    }


    csvWriter
    .writeRecords(results)
    .then(()=> console.log('Data uploaded into csv successfully'))
    .catch((error)=> console.log('Error ' + error));
}

module.exports = {
    write_csv: function (portfolio) {
        write_csv_async(portfolio);
    }
};
