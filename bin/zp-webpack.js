#! /usr/bin/env node

// 1. 找到当前执行文件的路径, 拿到webpack配置文件
const path = require("path");
// config 配置文件
const config = require(path.resolve(process.cwd(), 'webpack.config.js'));
const Compiler = require("../lib/compiler.js");
const compiler = new Compiler(config);

// 标识运行编译
compiler.run();