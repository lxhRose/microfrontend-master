import * as singleSpa from 'single-spa';
import { loadApp } from './helper';

const IS_DEV = process.env.NODE_ENV === 'development';

init();
async function init() {
  const loadingPromises = [];

  // root模块
  loadingPromises.push(
    loadApp(
      'root',
      '',
      IS_DEV ? 'http://localhost:9001/main.js' : './root/main.js'
    )
  );
  // angular模块
  loadingPromises.push(
    loadApp(
      'angular',
      '/angular',
      IS_DEV ? 'http://localhost:9002/main.js' : './angular/main.js'
    )
  );
  // inpNurse模块
  loadingPromises.push(
    loadApp(
      'inpNurse',
      '/inpNurse',
      IS_DEV ? 'http://localhost:9003/main.js' : './inpNurse/main.js'
    )
  );
  await Promise.all(loadingPromises);

  singleSpa.start();
}
