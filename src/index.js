const Shipit = require("shipit-cli");
const deploy = require("shipit-deploy");
const npm = require("./npm");
const copy = require("./copy");
const pm2 = require("./pm2");
const plugin = require("./plugin");
const error = require("./error");
const { Type } = require("schema-verify");

async function projectDeploy(defaultConf, envConf, branch) {
    const shipit = new Shipit({ environment: "special" });
    const runTasks = ["deploy"];
    defaultConf = Type.object.safe(defaultConf);
    envConf = Type.object.safe(envConf);
    if (Type.string.isNotEmpty(branch)) {
        envConf["branch"] = branch;
    }
    const config = {
        default: defaultConf,
        special: envConf
    };

    deploy(shipit);
    npm(shipit);
    copy(shipit);
    pm2(shipit);
    plugin(shipit);
    error(shipit);

    shipit.initConfig(config);
    shipit.initialize();

    shipit.start(runTasks);
}

module.exports = projectDeploy;
