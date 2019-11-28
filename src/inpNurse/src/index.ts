import dva from "dva";
import RouterConfig from './router';
import {
  AppModel,
} from './layout/index';

const app = dva();
app.router(RouterConfig);
app.model(AppModel);
// app.start("#inpNurse");
export default app.start();
