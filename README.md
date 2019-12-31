一、项目结构：
---
开发代码位于 src/
1. src/portal目录：整个微前端大脑，开发过程中基本不会涉及。
2. src/common目录：公共 js、css 存放位置;
3. src/base是基应用，src/batch、src/inpNurse、src/sysConfig 都是子应用。


二、启动运行：
---
1. 安装依赖包：npm run i-all
2. 启动：yarn start
3. 打开浏览器访问：
  localhost:9000
4. 部分启动：
  如果不想全部启动，可以先启动 portal 和 base；然后再启动你需要启动的项目即可；
  具体启动方式可以查看各应用对应的 package.json 文件。
5. 独立运行：
  请阅读单个项目的 README.md 文件。


三、构建部署：
---
1. 构建：
  npm run build，生成文件位于根目录 build 文件夹。
2. 独立打包：
  如果执行过【独立运行】，请先恢复代码，然后在对应应用根目录下运行：
  npm run build
3. 去缓存：
  如果想在部署的时候避免缓存带来的困扰，
  只需要修改与当前文件同级的 package.json 中的 version 字段即可。


