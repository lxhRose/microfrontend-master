import dva from "dva";
import RouterConfig from './router';
import {
  AppModel,
  LoginModel,
} from './layout/index';

const app = dva();
app.router(RouterConfig);
app.model(AppModel);
app.model(LoginModel);
// app.start("#root");
export default app.start();
