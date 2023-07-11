require('express-group-routes')
const express = require('express');
const { print_routes_list } = require('./utils/server_routes');
const { build_routes_handlers } = require('./routes_handlers');
const { fork } = require('child_process')

const serverPort = 3002
const app = express();
let processDatabase = null;

app.use(express.json());



if (process.argv.length === 3) {
    switch (process.argv[2]) {
        case 'start':
            app.listen(serverPort, () => {
                // Database.Get();
                processDatabase = fork('./services/database.process');
                build_routes_handlers(app, processDatabase)
                processDatabase.send({ action: "init" });
            });
            break;
        case 'routes':
            print_routes_list(app)
            break;
    }
}


module.exports = { app }