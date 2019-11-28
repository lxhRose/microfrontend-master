要本地独立运行，请做以下修改：
1、src/index.ts文件：
（1）注释 export default app.start();
（2）放开 app.start("#root");

完成以上步骤后执行：yarn run independent;
访问 http://localhost:8001
