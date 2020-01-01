import * as singleSpa from 'single-spa';
import { loadApp } from './helper';

init();
async function init() {
  const loadingPromises = [
    creatLoadApp('base', 9001), // base应用
    creatLoadApp('batch', 9002), // batch应用
    creatLoadApp('inpNurse', 9003), // inpNurse应用
    creatLoadApp('sysConfig', 9004), // sysConfig应用
  ];
  await Promise.all(loadingPromises);

  singleSpa.start();
}

// VERSION 来源于根目录的package.json 中的version字段，此处使用的定义在webpack.config.js中
function creatLoadApp(appName, port) {
  return loadApp(
    appName,
    appName === 'base' ? '' : `/${appName}`,
    process.env.NODE_ENV === 'development'
      ? `http://localhost:${port}/main.js?v${VERSION}`
      : `/${appName}/main.js?v${VERSION}`
  )
}
