/**
 * 方向键事件绑定
 * 吕兴海
 * 2019-12-11
 */
const DirectionKey = {
  domName: null,
  inputList: [],
  settings: null,
  initFocus: function () {
    if (this.inputList.length > 0) {
      this.inputList[0].focus();
    }
  },
  removeFocus: function () {
    if (this.inputList.length > 0) {
      this.inputList[0].blur();
    }
  },
  onkeydown(event) {
    if (event.key == 'Tab') {//ArrowUp上  ArrowDown下  ArrowRight右  ArrowLeft左
      if (document.all) {
        event.returnValue = false
      } else {
        event.preventDefault()
      }
      return false
    }
    if (event.key == 'Enter' || event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowRight' || event.key == 'ArrowLeft') {
      const value = event.key ? event.key : event.code;
      return this.tab(value)
    }
  },
  //获取页面input
  tab(key) {
    let dom = document.getElementById(this.domName);
    if (!dom) return false;
    //获取当前页面获得焦点的元素
    const activeIpt = document.activeElement
    let firstElm = null
    if (!!(window as any).ActiveXObject || "ActiveXObject" in window) {
      firstElm = document.documentElement
    } else {
      firstElm = dom
    }
    let next = null;
    //下个兄弟元素获取焦点
    if (document.activeElement == document.querySelector('body') || document.activeElement == firstElm) {
    } else {
      const inputIndex = this.inputList.findIndex(item => item == activeIpt);
      if (key === "Enter" || key === "ArrowRight") {
        next = this.skipInputDisabled(inputIndex, null, (index, nextInput) => {
          let returnNext = null;
          if (index < this.inputList.length - 1) {
            returnNext = this.inputList[index + 1];
          } else {
            returnNext = this.inputList[0];
          }
          return { index: index + 1, next: returnNext }
        })
        next && next.focus();
      } else if (key === "ArrowLeft") {
        next = this.skipInputDisabled(inputIndex, null, (index, nextInput) => {
          let returnNext = null;
          if (index === 0) {
            returnNext = this.inputList[this.inputList.length - 1];
          } else {
            returnNext = this.inputList[index - 1];
          }
          return { index: index - 1, next: returnNext }
        })
        next && next.focus();
      } else if (key === "ArrowDown") {//this.settings.inputLengthRow
        next = this.skipInputDisabled(inputIndex, null, (index, nextInput) => {
          const rowLength = this.inputList.length / this.settings.inputLengthRow;
          let returnIndex = null;
          let returnNext = null;
          if (index === this.inputList.length - 1) { // 总的最后一个
            returnNext = this.inputList[0];
            returnIndex = 0;
          } else if (
            Math.floor(index / this.settings.inputLengthRow) + 1 === rowLength
          ) {
            returnIndex = (index % this.settings.inputLengthRow) + 1;
            returnNext = this.inputList[returnIndex];
          } else {
            returnIndex = index + this.settings.inputLengthRow;
            returnNext = this.inputList[returnIndex];
          }
          return { index: returnIndex, next: returnNext }
        })
        next && next.focus();
        // }
      } else if (key === "ArrowUp") {
        next = this.skipInputDisabled(inputIndex, null, (index, nextInput) => {
          const rowLength = this.inputList.length / this.settings.inputLengthRow;
          let returnIndex = null;
          let returnNext = null;
          if (index === 0) {
            returnIndex = this.inputList.length - 1;
            returnNext = this.inputList[returnIndex];
          } else if (Math.floor(index / this.settings.inputLengthRow) === 0) {
            returnIndex = (rowLength - 1) * this.settings.inputLengthRow + (index - 1);
            returnNext = this.inputList[returnIndex];
          } else {
            returnIndex = index - this.settings.inputLengthRow
            returnNext = this.inputList[returnIndex];
          }
          return { index: returnIndex, next: returnNext }
        })
        next && next.focus();
      }
      if (next && this.settings.xLeft && next.getBoundingClientRect().left < this.settings.xLeft) {//从最后一个跳到第一个，横向滚动条从0开始
        dom.getElementsByClassName("ant-table-body")[0].scrollLeft = 0
      }
    }
  },
  //不能输入input输入框筛选
  skipInputDisabled(index, next, callback) {
    if (this.inputList.length > 1 && (!next || next.disabled)) {
      const returnObj = callback(index, next);
      return this.skipInputDisabled(returnObj.index, returnObj.next, callback);
    } else {
      return next;
    }
  }
}

export default DirectionKey;
