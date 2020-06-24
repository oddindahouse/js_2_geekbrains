const fs = require('fs');
const util = require('util');
const path = require('path');
const moment = require('moment');

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const statFile = util.promisify(fs.stat);
const logFile = path.resolve(__dirname, './log/cartLog.json');

exports.logAction = (action) => {
    statFile(logFile)
        .then(() => {
            readFile(logFile, 'utf-8')
                .then(logString => {
                    const log = JSON.parse(logString);
                    const logMsg = `${moment().format('MMMM Do YYYY, h:mm:ss a')} :: ${action}`;
                    log.actions.push(logMsg);
                    console.log(`LOGGER : ${logMsg}`);
                    writeFile(logFile, JSON.stringify(log, null , 4), 'utf-8')
                        .catch(err => {
                            console.log(err);
                        })
                }).catch(err => {
                console.log(err);
            })
        })
        .catch(() => {
            writeFile(logFile, JSON.stringify({"actions": []}), 'utf-8');
        })

}