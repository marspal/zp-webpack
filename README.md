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

5. loaders

- less-loader

```js
  let less = require("less");
  function loader(source){
    let css = "";
    less.render(source, function(err, c){
      console.error(err);
      if(!err) css = c.css;
    })
    return css;
  }
  module.exports = loader;
```

- style-loader

```js
  function loader(source){
    let style = `
      let style = document.createElement('style');
      style.innerHTML=${JSON.stringify(source)}
      document.head.appendChild(style)
    `;
    return style;
  } 
  module.exports = loader;
```

6. 增加plugins

- 新增hooks 使用tapable, npm i tapable -D

```js
// 如果传递了插件
let plugins = this.config.plugins;
if(Array.isArray(plugins)){
  plugins.forEach(plugin => {
    plugin.apply(this)
  })
}
```

```js
class P {
  apply(compiler){
    compiler.hooks.emit.tap('p', function(){
      console.log("emit")
    })
  }
}
class P1 {
  apply(compiler){
    compiler.hooks.afterPlugins.tap('p1', function(){
      console.log("afterPlugins")
    })
  }
}
```




