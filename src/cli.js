#!/usr/bin/env node

const chalk = require("chalk");
const commander = require("commander");
const interpret = require("interpret");
const v8flags = require("v8flags");
const Liftoff = require("liftoff");
const minimist = require("minimist");
const path = require("path");
const fs = require("fs");
const { Type } = require("schema-verify");
const projectDeploy = require("./index");
const { ERR_MSG } = require("./constant");

const program = new commander.Command();
program
    .version("v1.0")
    .allowUnknownOption()
    .usage("<project> <env> <tag>")
    .option("--project <project>", "project name")
    .option("--env <env>", "environment")
    .option("--tag <tag>", "git tag")
    .option("--filePath <filePath>", "config file path");

const processArgv = process.argv.slice(2);
if (processArgv.length <= 0) {
    program.help();
}
const argv = minimist(processArgv);

const onExecute = function(liftEnv) {
    const cwd = liftEnv.cwd;
    const project = argv.project;
    const env = argv.env;
    const tag = argv.tag;
    const filePath = argv.filePath;
    let defaultConf = {};
    let envConf = {};
    if (Type.string.isNotEmpty(project) && Type.string.isNotEmpty(env)) {
        const defaultConfPath = path.join(cwd, project, `default.js`);
        const envConfPath = path.join(cwd, project, `${env}.js`);
        if (fs.existsSync(defaultConfPath)) {
            defaultConf = require(defaultConfPath);
        }
        if (fs.existsSync(envConfPath)) {
            envConf = require(envConfPath);
        }
    }
    if (Type.string.isNotEmpty(filePath)) {
        if (fs.existsSync(filePath)) {
            envConf = require(filePath);
        }
    }
    if (
        !Type.object.isNotEmpty(defaultConf) &&
        !Type.object.isNotEmpty(envConf)
    ) {
        throw new Error(ERR_MSG.emptyConfig);
    }
    projectDeploy(defaultConf, envConf, tag);
};

const onPrepare = function(liftEnv) {
    const project = argv.project;
    const env = argv.env;
    const tag = argv.tag;
    const filePath = argv.filePath;

    if (Type.string.is(project)) {
        console.log(chalk.blue(`project: ${project}`));
    }
    if (Type.string.is(env)) {
        console.log(chalk.blue(`project: ${env}`));
    }
    if (Type.string.is(tag)) {
        console.log(chalk.blue(`project: ${tag}`));
    }
    if (Type.string.is(filePath)) {
        console.log(chalk.blue(`project: ${filePath}`));
    }

    cli.execute(liftEnv, onExecute);
};

const cli = new Liftoff({
    name: "deploy-cli",
    extensions: interpret.jsVariants,
    v8flags
});

cli.prepare({}, onPrepare);
