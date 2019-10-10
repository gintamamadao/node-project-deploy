const utils = require("shipit-utils");
const path = require("path");
const ErrMsg = require("./error");
const { Type } = require("schema-verify");

const DIRECTIVE = "pm2:start";
const OVER_DIRECTIVE = "pm2:started";

async function task(shipit) {
    const config = Type.object.safe(shipit.config);
    const pm2Info = config.pm2;
    if (Type.object.isNot(pm2Info)) {
        return;
    }
    const path = pm2Info.path;
    const delThread = pm2Info.delThread;
    let name = pm2Info.name;
    name = Type.string.isNotEmpty(name) ? name : path;
    if (!Type.string.isNotEmpty(name)) {
        throw new Error(ErrMsg.errorPm2Info);
    }
    let command = `pm2 startOrRestart ${name}`;
    if (delThread === true) {
        command = `pm2 delete ${name} && ${command}`;
    }
    await shipit.remote(command);
    shipit.emit(OVER_DIRECTIVE);
}

function install(shipit) {
    shipit = utils.getShipit(shipit);
    shipit.on("fetched", function() {
        utils.registerTask(shipit, DIRECTIVE, task);
        shipit.on("deployed", function() {
            shipit.start(DIRECTIVE);
        });
    });
}

module.exports = install;
