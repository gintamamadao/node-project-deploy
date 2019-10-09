const util = require("./util");
const baseConfig = require("./rollup.config");

module.exports = {
    ...baseConfig,
    output: {
        file: util.resolve("dist/node-project-deploy.js"),
        format: "cjs"
    }
};
