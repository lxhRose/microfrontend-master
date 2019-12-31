要本地独立运行，请做以下修改：
1、src/index.ts文件：
（1）注释以下代码
  const Root = app.start();
  Root.prototype.componentDidCatch = function (err, info) {
    console.log(err, info)
  }
  export default Root;
（2）放开 app.start("#inpNurse");

完成以上步骤后执行：yarn run independent;
访问 http://localhost:8003
