export const saveToken = (context,val) => {
    context.commit('saveToken',val);
};
export const removeToken = (context) => {
    context.commit('removeToken');
};

export const savePsdPhone = (context,val) => {
    context.commit('savePsdPhone',val);
};

export const removePsdPhone = (context) => {
    context.commit('removePsdPhone');
};

export const savePower = (context,val) => {
    context.commit('savePower',val);
};
export const saveMenuPower = (context,val) => {
    context.commit('saveMenuPower',val);
};

// 登录账号
export const saveAccount = (context,val) => {
    context.commit('saveAccount',val);
};

