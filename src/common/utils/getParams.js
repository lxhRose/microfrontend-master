// 获取url里的请求参数
function getParams(name) {
  var str, parastr;
  var array = []
  str = window.location.href;
  if (str.split("?")[1] != undefined && str.split("=")[1] != undefined) {
    parastr = str.split("?")[1];
    parastr = decodeURIComponent(parastr);
    var arr = []
    arr = parastr.split("&");

    for (var i = 0; i < arr.length; i++) {
      // array[arr[i].split("=")[0]] = arr[i].split("=")[1];
      if (arr[i].startsWith(name)) {
        // 避免token串中有=符号
        array[name] = arr[i].substring(name.length + 1);
      }
    }

  }

  return array[name];//project为所要获取的参数
}

export {
  getParams
}
