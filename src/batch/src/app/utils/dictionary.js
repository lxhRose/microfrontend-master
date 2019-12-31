let allDic = null;
let depart = null;
function setAllDic(data) {
  allDic = data;
}
function getAllDic() {
  return allDic;
}
function setDepart(data) {
  depart = data;
}
function getDepart() {
  return depart;
}

export {
  setAllDic,
  getAllDic,
  setDepart,
  getDepart
}
