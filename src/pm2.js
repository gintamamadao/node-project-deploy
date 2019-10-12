const utils = require("shipit-utils");
const { Type } = require("schema-verify");
const { EVENTS, ERR_MSG } = require("./constant");

const START_EVENT = "pm2:start";
const OVER_EVENT = "pm2:start Done";

async function task(shipit) {
    const config = Type.object.safe(shipit.config);
    const pm2Info = config.pm2;
    if (Type.object.isNot(pm2Info)) {
        shipit.emit(OVER_EVENT);
        return;
    }
    const path = pm2Info.path;
    const delThread = pm2Info.delThread;
    let name = pm2Info.name;
    name = Type.string.isNotEmpty(name) ? name : path;
    if (!Type.string.isNotEmpty(name)) {
        throw new Error(ERR_MSG.errorPm2Info);
    }
    let command = `pm2 startOrRestart ${name}`;
    if (delThread === true && Type.string.isNotEmpty(path)) {
        command = `pm2 delete ${name} && ${command}`;
    }
    await shipit.remote(command);
    shipit.emit(OVER_EVENT);
}

function install(shipit) {
    shipit = utils.getShipit(shipit);
    shipit.on(EVENTS.fetched, function() {
        utils.registerTask(shipit, START_EVENT, task);
        shipit.on(EVENTS.published, function() {
            shipit.start(START_EVENT);
        });
    });
}

module.exports = install;
