var excel = require('excel4node');
const yenv = require('yenv')
const vars = yenv('vars.yaml');


function write_xlsx_async(wallet){

    console.log("********************");
    console.log(wallet);

    let data = [];
    let headerRow = [];

    var workbook = new excel.Workbook();
    var worksheet = workbook.addWorksheet('Report')

    //define header
    worksheet.cell(1,1).string('Currency');


    if(wallet[0])
        keys = Object.keys(wallet[0].values_live);

    for(var i = 0; i < keys.length; i++){

        worksheet.cell(1,i+2).string(keys[i].toUpperCase().replace("_", " "));
    }

    let indexNewRow = 2;

    //add data
    for(var i= 0; i < wallet.length; i++){
        
        worksheet.cell(indexNewRow, 1).string(wallet[i].currency);

        for( y= 0; y < keys.length; y++){

            var key = keys[y];

            worksheet.cell(indexNewRow, y + 2).string(wallet[i].values_live[key]);
        }

        indexNewRow += 1;
    }
    
    workbook.write(vars.PATH_WALLET_XLSX, function(err, stats) {
        if (err) {
            console.log('Error ' + err)
        } else {
            console.log('Data uploaded into xlsx successfully')
        }
    });

}

module.exports = {
    write_xlsx: function (wallet) {
        write_xlsx_async(wallet);
    }
};
