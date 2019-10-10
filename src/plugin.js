const utils = require("shipit-utils");
const ErrMsg = require("./error");
const { Type } = require("schema-verify");
const { EVENTS } = require("./constant");

const PluginSchema = new Schema({
    type: Object,
    props: [
        {
            type: String,
            index: "name",
            required: true
        },
        {
            type: String,
            index: "afterEvent",
            required: true,
            enum: EVENTS
        },
        {
            type: Function,
            index: "task",
            required: true
        }
    ]
});

function install(shipit) {
    shipit = utils.getShipit(shipit);
    const config = Type.object.safe(shipit.config);
    const plugins = Type.array.safe(config.plugins);
    for (const plugin of plugins) {
        if (!PluginSchema.verify(plugin)) {
            throw new Error(ErrMsg.errorPluginInfo);
        }
        const name = plugin.name;
        const afterEvent = plugin.afterEvent;
        const task = plugin.task;
        shipit.on(EVENTS.fetched, function() {
            utils.registerTask(shipit, name, task);
            shipit.on(afterEvent, function() {
                shipit.start(name);
            });
        });
    }
}

module.exports = install;
