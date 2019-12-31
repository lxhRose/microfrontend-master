import dva from "dva";
import { createBrowserHistory as createHistory } from 'history';
import RouterConfig from './router';
import {
  AppModel,
  LoginModel,
} from './layout/index';
import "./style.less";

const app = dva({ history: createHistory() });
app.router(RouterConfig);
app.model(AppModel);
app.model(LoginModel);
// app.start("#root");
const Root = app.start();
Root.prototype.componentDidCatch = function (err, info) {
  console.log(err, info)
}
export default Root;
