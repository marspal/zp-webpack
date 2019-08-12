const path = require("path");
class Compiler{
  constructor(config){
    // entry output
    this.config = config;

    //1. 保存入口文件的路径
    this.entryId; // ./src/index.js
    //2. 保存所有的模板依赖
    this.modules = {};
    //3. 入口路径
    this.entry = config.entry;
    //4. 工作路径
    this.root = process.cwd();
  }
  buildModule(modulePath, isEntry){
    
  }
  emitFile(){}
  run(){
    // 执行 并创建模块的依赖关系 true组模块
    this.buildModule(path.resolve(this.root, this.entry), true);

    // 发射文件
    this.emitFile()
  }
}

module.exports = Compiler;