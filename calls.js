const md5 = require('md5');
const FormData = require('form-data');
const axios = require('axios');

function checkHash(file, apiKey) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.metadefender.com/v4/hash/';
        const options = {
            'headers': {
                'apikey': apiKey
            }
        };
        const hash = md5(file).toString().toUpperCase();
        // const hash = 'E7BC11A5200F9A8F30A66A0DBD63687F777DCE4E';
        axios.get(url + hash, options)
            .then((res) => reject(res))
            .catch((e) => resolve(e.response.data.error))
    });
}

function scanFile(file, apiKey) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.metadefender.com/v4/file/';
        const formdata = new FormData();
        formdata.append('file', file);

        const options = {
            'headers': {
                'apikey': apiKey,
                'content-type': formdata.getHeaders()['content-type'],
                "Content-Type": "multipart/form-data"
            }
        }

        axios.post(url, formdata, options)
            .then((res) => resolve(res))
            .catch((e) => reject(e))
    })
}

function pullDataId(dataId, apiKey) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.metadefender.com/v4/file/' + dataId;
        const options = {
            'headers': {
                'apikey': apiKey
            }
        }

        axios.get(url, options)
            .then((res) => {
                console.log('completion: ' + res.data.scan_results.progress_percentage + '%');
                if (res.data.scan_results.progress_percentage == 100)
                    reject(res);
                else
                    resolve(pullDataId(dataId, apiKey))
            })
            .catch((e) => console.log(e))
    })
}

module.exports = {
    checkHash: checkHash,
    scanFile: scanFile,
    pullDataId: pullDataId
}