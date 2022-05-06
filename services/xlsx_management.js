var excel = require('excel4node');
const yenv = require('yenv')
const vars = yenv('vars.yaml');


function write_xlsx_async(wallet){

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

    //add other columns to the header
    worksheet.cell(1,keys.length + 2).string("INVESTEMENT");
    worksheet.cell(1,keys.length + 3).string("NEW TOKEN");
    worksheet.cell(1,keys.length + 4).string("SUM TOKEN");
    worksheet.cell(1,keys.length + 5).string("AVERAGE PRICE FOR MONEY NEW");
    worksheet.cell(1,keys.length + 6).string("NEW PERCENTAGE DIFFERENCE");

    let indexNewRow = 2;

    //add data
    for(var i= 0; i < wallet.length; i++){
        
        worksheet.cell(indexNewRow, 1).string(wallet[i].currency);

        for( y= 0; y < keys.length; y++){

            var key = keys[y];

            worksheet.cell(indexNewRow, y + 2).string(wallet[i].values_live[key]);
        }

        //add values template
        worksheet.cell(indexNewRow, keys.length + 2).number(0);
        worksheet.cell(indexNewRow, keys.length + 3).formula('I'+indexNewRow+' / F'+ indexNewRow);
        worksheet.cell(indexNewRow, keys.length + 4).formula('J'+indexNewRow+' + H'+ indexNewRow);
        worksheet.cell(indexNewRow, keys.length + 5).formula('(C'+indexNewRow +'+ I'+indexNewRow+') / K'+indexNewRow);
        worksheet.cell(indexNewRow, keys.length + 6).formula('(F'+ indexNewRow +'/L'+ indexNewRow +' - 1 ) * 100');

        indexNewRow += 1;
    }

    var sum_1 = 'G2';
    var sum_2 = 'M2';

    for(var i = 0; i < indexNewRow - 3; i++){
        sum_1 = sum_1.concat('+').concat('G').concat(i + 3);
        sum_2 = sum_2.concat('+').concat('M').concat(i + 3);
    }
                                        
    worksheet.cell(indexNewRow + 2, 7).formula('(' + sum_1 + ' ) / ' + (indexNewRow - 2).toString());
    worksheet.cell(indexNewRow + 2, 13).formula('(' +  sum_2 +' ) / ' + (indexNewRow - 2).toString());

    
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
