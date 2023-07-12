const { Database } = require("../Database");
const { TYPES_CLASS } = require("../utils/maps");

/** @type {Database} */
let db = null;
let processors = {
    'init': ({ action }) => {
        db = Database.Get();
        process.send({ replyTo: action, status: 'done' })
    },
    'batchPost': ({ action, payload, mediaTypeClass }) => {
        process.send({ replyTo: action, status: "done", payload: payload.map(jsonObject => db.add(mediaTypeClass.fromJson(jsonObject))) })
    },
    'batchDelete': ({ action, payload }) => {
        process.send({ replyTo: action, status: "done", payload: payload.map(jsonObject => db.remove(jsonObject.id)) })
    },
    'batchUpdate': ({ action, payload }) => {
        process.send({ replyTo: action, status: "done", payload: payload.map(jsonObject => db.update(jsonObject.id, jsonObject)) })
    },
    'getAll': ({ action, mediaTypeClass }) => {
        process.send({ replyTo: action, status: "done", payload: db.findAllOf(mediaTypeClass) })
    },
    'get': ({ action, urlParams }) => {
        process.send({ replyTo: action, status: "done", payload: db.find(urlParams.id) })
    },
    'delete': ({ action, urlParams }) => {
        process.send({ replyTo: action, status: "done", payload: db.remove(urlParams.id) })
    },
    'post': ({ action, mediaTypeClass, payload }) => {
        process.send({ replyTo: action, status: "done", payload: db.add(mediaTypeClass.fromJson(payload)) })
    },
    'update': ({ action, mediaTypeClass, payload }) => {
        process.send({ replyTo: action, status: "done", payload: db.update(payload.id, mediaTypeClass.fromJson(payload)) })
    },
}


async function processMessage(params) {
    let release = null
    if (params.action !== 'init') {
        release = await db.getLock();
        processors[params.action](params);
        release()
    } else {
        processors[params.action](params);
    }
}

process.on("message", async (message) => {
    let { action, mediaType, payload = {}, urlParams = [] } = message;
    let mediaTypeClass = TYPES_CLASS[mediaType]
    await processMessage({ action, mediaTypeClass, payload, urlParams })
    console.log("[Database] " + (action));
})
