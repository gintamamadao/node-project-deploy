#!/usr/bin/env node

const chalk = require("chalk");
const commander = require("commander");
const interpret = require("interpret");
const v8flags = require("v8flags");
const Liftoff = require("liftoff");
const minimist = require("minimist");
const program = new commander.Command();

program
    .version("v1.0")
    .allowUnknownOption()
    .usage("<project> <env> <tag>")
    .option("--project <project>", "project name")
    .option("--env <env>", "environment")
    .option("--tag <tag>", "git tag");

const processArgv = process.argv.slice(2);
if (processArgv.length <= 0) {
    program.help();
}
const argv = minimist(processArgv);

const onExecute = function(liftEnv) {
    const project = argv.project;
    const env = argv.env;
    const tag = argv.tag;
};

const onPrepare = function(liftEnv) {
    const project = argv.project;
    const env = argv.env;
    const tag = argv.tag;

    console.log(chalk.blue(`project: ${project}`));
    console.log(chalk.blue(`environment: ${env}`));
    console.log(chalk.blue(`tag: ${tag}`));

    cli.execute(liftEnv, onExecute);
};

const cli = new Liftoff({
    name: "deploy-cli",
    extensions: interpret.jsVariants,
    v8flags
});

cli.prepare({}, onPrepare);
