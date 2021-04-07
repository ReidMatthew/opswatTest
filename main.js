const opswat = require('./calls');
const fs = require('fs');

var filePath = '';
var apiKey = '';

main();
async function main() {
    var args = process.argv.slice(2);
    if (args[0]) filePath = args[0].toString();
    if (args[1]) apiKey = args[1].toString();

    try { var file = fs.readFileSync(filePath) }
    catch (e) {
        console.log('Bad file path');
        return;
    }

    try {
        await opswat.checkHash(file, apiKey);

        const scan = await opswat.scanFile(file, apiKey);

        await opswat.pullDataId(scan.data.data_id, apiKey);
    }
    catch (reject) {
        console.log(reject)
        formatFile(reject.data);
    }
}

function formatFile(data) {
    var output = '\n\nfilename: ' + data.file_info.display_name.toString() + '\n';
    output += 'overall_status: ' + data.scan_results.scan_all_result_a.toString() + '\n';

    data = data.scan_results.scan_details;
    for (let eng in data) {
        output += '\nengine: ' + eng.toString() + '\n';
        output += 'threat_found: ' + data[eng].threat_found + '\n';
        output += 'scan_result: ' + data[eng].scan_result_i + '\n';
        output += 'def_time: ' + data[eng].def_time + '\n';
    }

    /*
        MORE INTERESTING
            replaceAll not on version
    for (let eng in data) {
        output += 'engine: ' + eng.toString() + '\n';
        delete eng.scan_time;
        output += JSON.stringify(data[eng]).split(',').join('\n') + '\n';
    }
    output.replaceAll(/[{"}]/g, '');
    */

    output += '\nEND';

    console.log(output);
}