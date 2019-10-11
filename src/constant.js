const EVENTS = {
    fetched: "fetched",
    updated: "updated",
    published: "published",
    cleaned: "cleaned",
    deployed: "deployed"
};

const ERR_MSG = {
    needWorkspace: "缺少工作目录",
    errorCopyInfo: "错误的复制配置",
    errorPm2Info: "错误的PM2配置",
    errorPluginInfo: "错误的插件配置",
    emptyConfig: "缺少部署配置"
};

module.exports = { EVENTS, ERR_MSG };
