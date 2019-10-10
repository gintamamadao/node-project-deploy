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
            index: "hookEvent",
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
        const taskFn = async function(shipit) {
            const overName = `${name} Done`;
            const config = Type.object.safe(shipit.config);
            const remoteFn = async function(command) {
                await shipit.remote(command);
            };
            const localFn = async function(command) {
                await shipit.local(command);
            };
            const emitFn = async function(eventName) {
                await shipit.emit(eventName);
            };
            await task(config, remoteFn, localFn, emitFn);
            shipit.emit(overName);
        };
        shipit.on(EVENTS.fetched, function() {
            utils.registerTask(shipit, name, taskFn);
            shipit.on(afterEvent, function() {
                shipit.start(name);
            });
        });
    }
}

module.exports = install;
