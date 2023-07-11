const { parentPort, workerData } = require('worker_threads');
const { TYPES_CLASS } = require("../utils/maps");
const { Database } = require('../Database');
const { Media } = require('../Media');

parentPort.on('message', () => {
    parentPort.postMessage(
        run()
    );
})

// We got to put Database interaction logic here: it's too heavy to 
// place it in the main-thread (may cause a thread-lock!!)
function run() {
    let {
        jsonDatabase,
        jsonRequest,
        iMediaCounter,
        sMediaType, } = workerData
    let db = Database.Get()
    let mediaTypeClass = TYPES_CLASS[sMediaType];
    let result = null;
    db.fromJson(jsonDatabase)
    Media.setID(iMediaCounter);

    result = {
        mediaItems: jsonRequest.map(jsonObject => db.add(mediaTypeClass.fromJson(jsonObject))),
        iMediaCounter: Media.ID,
        jsonDatabase: db.serialize()
    }


    return result;
}