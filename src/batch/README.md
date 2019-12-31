要本地独立运行，请做以下修改：
1、angular.json文件：
"main": "src/main.single-spa.ts" --> "main": "src/main.ts"

2、extra-webpack.config.js文件：
（1）注释
  const singleSpaWebpackConfig = singleSpaAngularWebpack(angularWebpackConfig, options)
  ...
  return singleSpaWebpackConfig
（3）放开 return angularWebpackConfig

完成以上步骤后执行：ng server
访问 http://localhost:4200

关于antd组件的使用：
由于全部引入会导致应用特别臃肿，所以选择按需导入；
一、组件：
1、src/app/app.module.ts
（1）导入要使用的组件到 【// antd单独引入】
（2）在NgModule中imports:
  @NgModule({
    imports:[
      ...
    ]
  })
2、src/styles.less @import 对应样式文件。（示例以上文件中有）

二、图标：
1、src/app/icons-provider/icons-provider.module.ts
将要使用的图标输入icons数组中，比如user图标，
const icons = [
  UserOutline // 驼峰式命名：图标名 + Outline
];
