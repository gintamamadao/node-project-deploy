# node-project-deploy

> A Tool For Publishing Projects

## Summary

> 一个用于发布 js 项目的工具。本项目是在 [shipit-deploy](https://www.npmjs.com/package/shipit-deploy)和[shipit-cli](https://www.npmjs.com/package/shipit-cli) 这两个项目的基础上进行开发，添加一些更便捷的功能。

## Install

> 作为依赖安装

```sh
npm i node-project-deploy --save
```

> 全局安装

```sh
npm i node-project-deploy -g
```

> 全局安装指令

```sh
ln -s [node安装目录]/bin/deploy-cli /usr/local/bin/
```

## Usage

> 首先在当前目录以项目的名字创建 backend 文件夹，再在 backend 文件夹下创建以下两个文件 default.js 和 以环境命令的 testing.js。default.js 内是通用配置，testing.js 内是要发布的环境配置。

**`default.js` 文件例子**

> `default.js` 文件中的配置相当于[shipit-cli](https://www.npmjs.com/package/shipit-cli)配置中的 `default` 配置。

```js
module.exports = {
    workspace: "/tmp/myapp",
    deployTo: "/var/myapp",
    repositoryUrl: "https://github.com/user/myapp.git",
    ignores: [".git", "node_modules"],
    keepReleases: 2,
    keepWorkspace: false,
    deleteOnRollback: false,
    key: "/path/to/key",
    shallowClone: true,
    deploy: {
        remoteCopy: {
            copyAsDir: false
        }
    }
};
```

**`testing.js` 文件例子**

> `testing.js` 文件中的配置相当于[shipit-cli](https://www.npmjs.com/package/shipit-cli)配置中的环境`testing`配置。

```js
module.exports = {
    servers: "user@myserver.com"
};
```

**创建 tag 或者分支**

> 在 git 上创建一个发布的 tag 或者分支，下面用 `release_version` 表示。

**发布项目**

> 最后在当前目录执行命令。

```sh
deploy-cli --project=backend  --env=testing  --tag=release_version
```

> 以上操作的意思就是把 `backend` 项目的某个一个版本（`release_version`）发布到 `testing` 环境中，执行命令后，cli 工具会加载 `./backend/testing/default.js` 和 `./backend/testing/testing.js` 这两个`js`模块文件的配置，根据最后所得的配置发布。

# 目录

<!-- TOC -->

-   [Options](#options)
    -   [npm](#npm)
    -   [copyFile](#copyfile)
    -   [pm2](#pm2)
    -   [plugin](#plugin)
-   [deploy-cli](#deploy-cli)

# Options

> 项目保留了[shipit-deploy](https://www.npmjs.com/package/shipit-deploy) 中的所有配置选项，并没有做改动，只是在这的基础新加了一些配置选项。
> 下面只介绍新加的配置选项。

## npm

**Type: `Object`**

> `npm` 安装依赖相关的信息，该事件在触发插件 `shipit-deploy` 的 `fetched` 事件后注册，并且在 `shipit-deploy` 的 `published` 事件后触发。

-   触发事件名：`npm:install`
-   结束事件名：`npm:install Done`

### npm.remote

**Type: `Boolean`**

> 命令是在本地还是远程执行， 默认为 `false` , 表示在本地执行。

### npm.npmType

**Type: `String`**

> 安装所用插件的类型，默认为 `npm` , 表示用 `npm` 安装，如果设置为 `cnpm` ，则是用 `cnpm` 安装。

### npm.dependencies

**Type: `String Array`**

> 指定要安装哪些依赖，默认为空数组。

## copyFile

**Type: `Object Array`**

> 复制文件的任务信息，该事件在触发插件 `shipit-deploy` 的 `fetched` 事件后注册，并且在 `shipit-deploy` 的 `published` 事件后触发。触发顺序在 `npm` 后。

-   触发事件名：`file:copy`
-   结束事件名：`file:copy Done`

> 下面用 `copyFileItem` 表示数组的子项。

### copyFileItem.from

**Type: `String`**

> 被复制文件的地址。

### copyFileItem.to

**Type: `String`**

> 要放复制文件的地址。

## pm2

**Type: `Object`**

> 复制文件的任务信息，该事件在触发插件 `shipit-deploy` 的 `fetched` 事件后注册，并且在 `shipit-deploy` 的 `published` 事件后触发。触发顺序在 `copyFile` 后。

-   触发事件名：`pm2:start`
-   结束事件名：`pm2:start Done`

### pm2.path

**Type: `String`**

> 插件 `pm2` 的配置文件位置。

### pm2.delThread

**Type: `Boolean`**

> 是否先删除以前 pm2 所守护的同名进程。

## plugin

**Type: `Object Array`**

> 配置注册任务信息。用于便捷地注册任务。所有任务都会在插件 `shipit-deploy` 的 `fetched` 事件后注册。但触发任务的钩子函数要单独配置。

> 下面用 `pluginItem` 表示数组的子项。

### pluginItem.name

**Type: `String`**

> 任务的触发事件名。结束事件名会自动设置为 `${name} Done`

### pluginItem.hookEvent

**Type: `String`**

> 任务触发的钩子事件名。

### pluginItem.task

**Type: `Function`**

> 任务函数。形参为 `config, remoteHandle, localHandle, emitHandle`

-   config，发布配置信息
-   remoteHandle，远程执行命令的 async 函数
-   localHandle，本地执行命令的 async 函数
-   emitHandle，`shipit`的事件派发函数

### pluginItem.command

**Type: `String`**

> 任务要执行的命令，如果要执行的命令只是简单字符串，则不需要配置任务函数 `task` ，直接配置该项就可以了。

### pluginItem.remote

**Type: `Boolean`**

> 命令是在本地还是远程执行， 默认为 `false` , 表示在本地执行。

# deploy-cli

> 发布命令行工具。本项目与 `shipit-cli` 不同，`default` 配置和环境配置是分开文件存放，`deploy-cli` 作用是当前目录下根据项目名和环境名查找发布配置。

## --project

> 设置项目名，cli 工具会在当前目录下寻找命名为项目名的文件夹

## --env

> 设置环境名，cli 工具会在项目名文件夹下寻找命名为环境名的 `js` 文件和 `default.js`文件。

## --tag

> 设置要发布的版本，即在 git 上创建的 tag 或者分支。

## --filePath

> 不需要设置 `project` 和 `env`，直接指定一个 js 文件作为配置。

# License (MIT)

```
Copyright (c) 2019 gintamamadao

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
