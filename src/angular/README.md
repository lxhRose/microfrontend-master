要本地独立运行，请做以下修改：
1、angular.json文件：
"main": "src/main.single-spa.ts" --> "main": "src/main.ts"

2、extra-webpack.config.js文件：
（1）注释 const singleSpaWebpackConfig = singleSpaAngularWebpack(angularWebpackConfig, options)
（2）注释 return singleSpaWebpackConfig
（3）放开 return angularWebpackConfig

完成以上步骤后执行：ng server
访问 http://localhost:4200
