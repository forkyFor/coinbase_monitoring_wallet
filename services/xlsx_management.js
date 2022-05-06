var xlsxwriter = require('write-excel-file');
const yenv = require('yenv')
const vars = yenv('vars.yaml');


function write_xlsx_async(wallet){

    
}

module.exports = {
    write_xlsx: function (wallet) {
        write_xlsx_async(wallet);
    }
};
