const utils = require("shipit-utils");
const ErrMsg = require("./error");
const { EVENTS } = require("./constant");
const { Type, Schema } = require("schema-verify");

const TaskInfoSchema = new Schema({
    type: Object,
    props: [
        {
            type: String,
            index: "from",
            required: true
        },
        {
            type: String,
            index: "to",
            required: true
        }
    ]
});

const START_EVENT = "file:copy";
const OVER_EVENT = "file:copied";

async function task(shipit) {
    const config = Type.object.safe(shipit.config);
    let copyInfo = config.copyFile;
    let command = "";
    copyInfo = Type.object.is(copyInfo)
        ? [copyInfo]
        : Type.array.is(copyInfo)
        ? copyInfo
        : [];
    for (const info of copyInfo) {
        if (!TaskInfoSchema.verify(info)) {
            throw new Error(ErrMsg.errorCopyInfo);
        }
        const from = info.from;
        const to = info.to;
        if (Type.string.isNotEmpty(command)) {
            command = `${command} && cp -r ${from} ${to}`;
        } else {
            command = `cp -r ${from} ${to}`;
        }
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
