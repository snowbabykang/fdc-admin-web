import store from '@/vuex/store'
import router from '@/router'
import {getpower} from '@/service/getData'
function checkmenu(powerlist){
    let routes = router.options.routes;
    let obj = {};
    for(var i = 0 ; i < routes.length; i++){
        if(routes[i].meta && routes[i].meta.group){
            let isExist = false;
            for(var j = 0;j < routes[i].children.length; j++){
                if(routes[i].children[j].meta && routes[i].children[j].meta.powerid){
                    if(powerlist[routes[i].children[j].meta.powerid] !== undefined){
                        isExist = true;
                    }
                }
            }
            obj[i] = isExist;
        }else{
            obj[i] = false;
        }
    }
    store.dispatch('saveMenuPower',obj);
}
export default {
    getPower : () => {
        getpower().then((res) => {
            if(res && res.code == 200){
                let obj = {};
                for(var i in res.data.permissions){
                    obj[res.data.permissions[i].id] = res.data.permissions[i].permissionType;
                }
                store.dispatch('savePower',obj);
                checkmenu(obj);
            }
        })
    },
    getPopupContainer (trigger) {
      return trigger.parentElement
    },
}