import dva from "dva";
import RouterConfig from './router';
import {
  AppModel,
  ReportCenterModel
} from './layout/index';
import { createBrowserHistory as createHistory } from 'history';
import "./style.less";

const app = dva({ history: createHistory() });
app.router(RouterConfig);
app.model(AppModel);
app.model(ReportCenterModel);
// app.start("#inpNurse");
const Root = app.start();
Root.prototype.componentDidCatch = function (err, info) {
  console.log(err, info)
}
export default Root;
