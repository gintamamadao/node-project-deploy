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
            index: "task"
        },
        {
            type: String,
            index: "command"
        },
        {
            type: Boolean,
            index: "remote"
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
        const command = plugin.command;
        const remote = plugin.remote;
        const taskFn = async function(shipit) {
            const overName = `${name} Done`;
            const config = Type.object.safe(shipit.config);
            if (Type.function.is(task)) {
                const remoteHandle = async function(commandStr) {
                    await shipit.remote(commandStr);
                };
                const localHandle = async function(commandStr) {
                    await shipit.local(commandStr);
                };
                const emitHandle = async function(eventName) {
                    await shipit.emit(eventName);
                };
                await task(config, remoteHandle, localHandle, emitHandle);
            }
            if (Type.string.isNotEmpty(command)) {
                const workspace = config.workspace;
                if (remote === true) {
                    await shipit.remote(command);
                } else {
                    await shipit.local(command, {
                        cwd: workspace
                    });
                }
            }
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
