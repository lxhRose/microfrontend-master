import * as singleSpa from 'single-spa';
import { loadApp } from './helper';

const IS_DEV = process.env.NODE_ENV === 'development';

init();
async function init() {
  const loadingPromises = [];

  // base应用 VERSION 来源于根目录的package.json 中的version字段
  // 此处使用的定义在webpack.config.js中
  loadingPromises.push(
    loadApp(
      'base',
      '',
      IS_DEV ? `http://localhost:9001/main.js?v${VERSION}`
        : `/base/main.js?v${VERSION}`
    )
  );
  // batch应用
  loadingPromises.push(
    loadApp(
      'batch',
      '/batch',
      IS_DEV ? `http://localhost:9002/main.js?v${VERSION}`
        : `/batch/main.js?v${VERSION}`
    )
  );
  // inpNurse应用
  loadingPromises.push(
    loadApp(
      'inpNurse',
      '/inpNurse',
      IS_DEV ? `http://localhost:9003/main.js?v${VERSION}`
        : `/inpNurse/main.js?v${VERSION}`
    )
  );
  // sysConfig应用
  loadingPromises.push(
    loadApp(
      'sysConfig',
      '/sysConfig',
      IS_DEV ? `http://localhost:9004/main.js?v${VERSION}`
        : `/sysConfig/main.js?v${VERSION}`
    )
  );
  await Promise.all(loadingPromises);

  singleSpa.start();
}
