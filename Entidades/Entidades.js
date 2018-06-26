
var rp = require('request-promise');
var fse = require('fs-extra');
var path = require('path');

const LUIS_authoringKey = "dfdc1c531aea42298eb62105fdb6d52a";
const LUIS_appId = "e8838664-c1e4-41cd-b819-82fb018ba7df";
const LUIS_versionId = "0.1";
const uploadFile = "./utterances.json"

var trainAfterAdd = false;
var requestTrainingStatus = false;

if (process.argv.length >= 3) {
    if (process.argv[2] === "-train") {
        trainAfterAdd = true;
    } else if (process.argv[2] === "-status") {
        requestTrainingStatus = true;
    }
}


var sendUtteranceToApi = async (options) => {
    try {

        var response; 
        if (options.method === 'POST') {
            response = await rp.post(options);
        } else if (options.method === 'GET') {
            response = await rp.get(options);
        }
        
        return { request: options.body, response: response };

    } catch (err) {
        throw err;
    }
}

var configAddUtterance = {
    LUIS_authoringKey: LUIS_authoringKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    inFile: path.join(__dirname, uploadFile),
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId)
};

var addUtterance = async (config) => {

    try {
        var jsonUtterance = await fse.readJson(config.inFile);
        var utterancePromise = sendUtteranceToApi({
            uri: config.uri,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': config.LUIS_authoringKey
            },
            json: true,
            body: jsonUtterance
        });

        let results = await utterancePromise;
        let response = await fse.writeJson(config.inFile.replace('.json', '.results.json'), results);

        console.log("Add utterance done");

    } catch (err) {
        console.log(`Error adding utterance:  ${err.message} `);
    }

} 
var configTrain = {
    LUIS_authoringKey: LUIS_authoringKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/train".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId),
    method: 'POST', 
};


var train = async (config) => {

    try {

        var trainingPromise = sendUtteranceToApi({
            uri: config.uri,
            method: config.method,  
            headers: {
                'Ocp-Apim-Subscription-Key': config.LUIS_authoringKey
            },
            json: true,
            body: null      
        });

        let results = await trainingPromise;
        
        if (config.method === 'POST') {
            let response = await fse.writeJson(path.join(__dirname, 'training-results.json'), results);        
        } else if (config.method === 'GET') {
            let response = await fse.writeJson(path.join(__dirname, 'training-status-results.json'), results);
        }
        
    } catch (err) {
        console.log(`Error in Training:  ${err.message} `);
     
    }

}

if (trainAfterAdd) {
    addUtterance(configAddUtterance)
        .then(() => {
            configTrain.method = 'POST';
            return train(configTrain, false);
        }).then(() => {
            configTrain.method = 'GET';
            return train(configTrain, true);
        }).then(() => {
        });
} else if (requestTrainingStatus) {
    configTrain.method = 'GET';
    train(configTrain)
        .then(() => {
        });
}
else {
    addUtterance(configAddUtterance)
        .then(() => {
        });

}
