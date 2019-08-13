# zp-webpack

## 手写webpack 

> webpack 自己实现的webpack_require  模板文件
```js
  var modules = {};
  var installedModules = {}
  function _webpack_require(moduleId){
    if(installedModules[moduleId]){
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    }
    modules[moduleId].call(module.exports, module, module.exports, _webpack_require)
    module.l = true;
    return module.exports;
  }
```

> 创建打包库 zp-webpack

1. 创建命令行工具, npm link 映射到全局下面
  ```js
    "bin": {
      "zp-webpack": "./bin/zp-webpack.js"
    },
  ```

2. webpack分析及处理

3. 创建依赖关系

4. AST

  babylon 源码转化成AST
  @babel/types 替换
  @babel/generator 重新生成
  @babel/traverse 遍历AST


