const utils = require("shipit-utils");
const ErrMsg = require("./error");
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

const DIRECTIVE = "file:copy";
const OVER_DIRECTIVE = "file:copied";

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
