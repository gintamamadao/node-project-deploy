const Shipit = require("shipit-cli");
const deploy = require("shipit-deploy");
const npm = require("./npm");
const copy = require("./copy");
const pm2 = require("./pm2");
const plugin = require("./plugin");
const error = require("./error");

async function projectDeploy(commenConf, envConf) {
    const shipit = new Shipit({ environment: "special" });
    const runTasks = ["deploy"];
    const config = {
        default: commenConf,
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
