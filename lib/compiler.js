const path = require("path");
const fs = require("fs");
const babylon = require('babylon')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const ejs = require("ejs");

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
  getSource(path){
    return fs.readFileSync(path, 'utf8')
  }
  // 解析源码
  parse(source, parentPath){ // 解析语法叔
    // console.log(source, parentPath, '==');
    let ast = babylon.parse(source);
    let dependencies = [];
    traverse(ast, {
      CallExpression(p){
        let node = p.node;
        if(node.callee.name === 'require'){
          node.callee.name = '__webpack_require__'
          let moduleName = node.arguments[0].value;
          moduleName = moduleName + (path.extname(moduleName)? '' : '.js');
          moduleName = './'+path.join(parentPath, moduleName);
          dependencies.push(moduleName);
          node.arguments = [t.stringLiteral(moduleName)];
        }
      }
    })
    let sourceCode = generate(ast).code
    return {sourceCode, dependencies}    
  }
  // 构建模块依赖
  buildModule(modulePath, isEntry){
    // 拿到模块的类容、模块的id
    let source = this.getSource(modulePath)
    // 获取模块的名名字 this.entry?
    let moduleName = './' + path.relative(this.root, modulePath);
    // console.log(source, moduleName)
    if(isEntry){
      this.entryId = moduleName;
    }
    // require 变成 _webpack_require_ key: ./src/ 返回一个依赖列表
    let {sourceCode, dependencies} = this.parse(source, path.dirname(moduleName));
    this.modules[moduleName] = sourceCode;
    dependencies.forEach(dep => { // 附模块的加载, 递归加载
      this.buildModule(path.resolve(this.root, dep), false)
    })
  }
  emitFile(){
    //1. 拿到输出的目录, filename
    let main = path.join(this.config.output.path, this.config.output.filename);
    let templateStr = this.getSource(path.resolve(__dirname, 'main.ejs'));
    
    let code = ejs.render(templateStr, {
      entryId: this.entryId,
      modules: this.modules
    })
    this.assets = {};
    this.assets[main] = code;
    
    fs.writeFileSync(main, this.assets[main])
  }
  run(){
    // 执行 并创建模块的依赖关系 true入口模块
    this.buildModule(path.resolve(this.root, this.entry), true);

    // 发射文件
    this.emitFile()
  }
}

module.exports = Compiler;