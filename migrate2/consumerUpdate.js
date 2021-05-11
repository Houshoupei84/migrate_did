const process = require('process');
const consumer = require("./consumerCommon");

consumer("./update.csv")


process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});