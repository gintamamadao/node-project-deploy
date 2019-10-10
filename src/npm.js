const utils = require("shipit-utils");
const path = require("path");
const ErrMsg = require("./error");
const { Type } = require("schema-verify");

const NPM_TYPE = "npm";
const DIRECTIVE = "npm:install";
const OVER_DIRECTIVE = "npm:installed";

async function task(shipit) {
    const config = Type.object.safe(shipit.config);
    const workspace = config.workspace;
    const deployTo = config.deployTo;
    let npmInfo = config.npm;
    if (!Type.string.isNotEmpty(workspace)) {
        throw new Error(ErrMsg.needWorkspace);
    }
    if (Type.object.isNot(npmInfo) && npmInfo !== true) {
        shipit.emit(OVER_DIRECTIVE);
        return;
    }
    npmInfo = Type.object.safe(npmInfo);
    const dependencies = Type.array.safe(npmInfo.dependencies);
    const dependsStr = dependencies.join(" ");
    let npmType = npmInfo.npmType;
    npmType = Type.string.isNotEmpty(npmType) ? npmType : NPM_TYPE;

    let command = `${npmType} i ${dependsStr}`;
    if (npmInfo.remote === true) {
        const current = path.join(deployTo, "current");
        command = `cd ${current} && ${command}`;
        await shipit.remote(command);
    } else {
        await shipit.local(command, {
            cwd: workspace
        });
    }
    shipit.emit(OVER_DIRECTIVE);
}

function install(shipit) {
    shipit = utils.getShipit(shipit);
    shipit.on("fetched", function() {
        utils.registerTask(shipit, DIRECTIVE, task);
        const config = Type.object.safe(shipit.config);
        const npmInfo = Type.object.safe(config.npmInfo);
        if (npmInfo.remote === true) {
            shipit.on("published", function() {
                shipit.start(DIRECTIVE);
            });
        } else {
            shipit.start(DIRECTIVE);
        }
    });
}

module.exports = install;
