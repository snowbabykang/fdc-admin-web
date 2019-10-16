import { state } from "./initState"
var copyState = deepClone(state) // 拷贝state对象
function deepClone (obj) {
  var newObj = obj instanceof Array ? [] : {}
  for (var i in obj) {
    newObj[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
  }
  return newObj
}
export default {
    // 退出登录初始化
    resetState (state) {
      for (var i in copyState) {
        state[i] = copyState[i] // 递归赋值
      }
    },
    saveToken(state,val){
        state.token = val;
    },
    removeToken(state){
        state.token = '';
    },
    savePsdPhone(state,val){
        state.changePsdPhone = val;
    },
    removePsdPhone(state){
        state.changePsdPhone = "";
    },
    savePower(state,val){
        state.powerList = val;
    },
    saveMenuPower(state,val){
        state.menuPower = val;
    },
    saveAccount(state,val){
        state.account = val;
    },
}