const utils = require("shipit-utils");
const { Type } = require("schema-verify");

function task(msg, err) {
    msg = Type.string.isNotEmpty(err)
        ? err
        : err && err.message
        ? err.message
        : msg;
    throw new Error(msg);
}

function install(shipit) {
    shipit = utils.getShipit(shipit);
    shipit.on("task_err", task.bind(this, "任务出错"));
    shipit.on("task_not_found", task.bind(this, "未找到任务"));
}

module.exports = install;
