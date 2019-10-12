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

**创建 tag 或者 分支**

> 在 git 上创建一个发布的 tag 或者 分支

**发布项目**

> 最后在当前目录执行命令

```sh
deploy-cli --project=backend  --env=testing  --tag=release_tag
```

> 以上操作的意思就是把 `backend` 项目的某个一个版本（`release_tag`）发布到 `testing` 环境中，执行命令后，cli 工具会加载 `./backend/testing/default.js` 和 `./backend/testing/testing.js` 这两个`js`模块文件的配置，根据最后所得的配置发布。

# 目录

<!-- TOC -->

-   [Options](#options)

# Options

> 项目保留了[shipit-deploy](https://www.npmjs.com/package/shipit-deploy) 中的所有配置选项，并没有做改动，只是在这的基础新加了一些配置选项。
> 下面只介绍新加的配置选项。
