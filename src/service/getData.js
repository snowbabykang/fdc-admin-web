import fetch from '../api/fetch'
import store from '../vuex/store';

/**
 * fetch参数说明，可查看fetch.js
 * 方法名 = （参数） =>  fetch(请求链接，请求参数，请求类型，请求域名的名（默认api就是后端接口的域名）)
 */

// 校验图片验证码
export const verifyImgCode = (code) => fetch('/admin/login/verifyCode', {tryCode : code}, 'GET','api');

//登录
export const login = (username,password) => fetch('/admin/login', {
    userName : username,
    password : password,
}, 'POST','api');

// 注销 退出登录
export const logout = () => fetch('/admin/login/logout', {}, 'POST','api');

//修改密码获取短信验证码
export const getMsgCode = (phone) => fetch('/admin/login/getMsgCode', {phoneNum : phone}, 'GET','api');

// 验证短信验证码
export const verifyMsgCode = (phone,code) => fetch('/admin/login/verifyMsgCode', {
    phone : phone ,
    verificationCode : code
}, 'GET','api');

// 修改密码
export const changePsd = (username,password) => fetch('/admin/login/changePassword', {
    userName : username,
    password : password
}, 'PUT','api');

// 获取登陆者权限
export const getpower = () => fetch('/admin/role/userAndPers', {}, 'GET','api');



//服务类目
export const getCategory = () => fetch('/commodity/type', {}, 'GET','api');

// 新增服务类目
export const addCategory = (name,pid) => fetch('/commodity/type/add', {
    commodityTypeName : name,
    pid : pid
}, 'POST','api');

// 修改服务类名
export const updateCategory = (name,id) => fetch('/commodity/type/name', {
    commodityTypeName : name,
    id : id
}, 'PUT','api');

/**
    排序服务类目
    moveId     被拖动类目id
    targetId   目标类目id
    type       操作类型   before：之前,after：之后
*/
export const sortCategory = (moveId,targetId,type) => fetch('/commodity/type/sort', {
    moveId : moveId,
    targetId : targetId,
    type : type,
}, 'PUT','api');

// 删除服务类目
export const deleteCategory = (ids) => fetch('/commodity/type/del', {list : ids}, 'put','api');





//机构
// 查询总管理数据列表
export const getOrglist = (name,status,type,page,size) => fetch('/admin/org/orglist', {
    orgName : name,
    status : status,
    type : type,
    page : page || 1,
    size : size || 10,
}, 'GET','api');

// 查询企业认证数据列表
export const getOrgRzlist = (account,name,status,page,size) => fetch('/admin/org/orgrzlist', {
    account : account,
    orgName : name,
    status : status,
    page : page || 1,
    size : size || 10,
}, 'GET','api');

// 查询资质认证数据列表
export const getOrgShlist = (account,name,status,page,size) => fetch('/admin/org/orgShlist', {
    account : account,
    orgName : name,
    status : status,
    page : page || 1,
    size : size || 10,
}, 'GET','api');




// 根据机构id获取最新机构认证信息
export const getCompanyInfo = (id) => fetch('/admin/org', {id : id}, 'GET','api');

// 根据机构id获取机构资质审核信息
export const getOrgAuth = (id) => fetch('/admin/org/getOrgAuth', {id : id}, 'GET','api');

// 审核资质
export const auditOrgAuth = (emId,orgId,id,status,reason) => fetch('/admin/org/auditOrgAuth', {
    emId : emId,
    orgId : orgId,
    orgQualificationId : id,
    status : status,
    reason : reason
}, 'POST','api');


// 根据机构id获取保证金信息
export const getMargin = (id) => fetch('/admin/store/getMargin', {id : id}, 'GET','api');

// 审核保证金
export const auditMargin = (id,status,storeid,reason) => fetch('/admin/store/auditMargin', {
    id : id,
    status : status,
    storeId : storeid,
    reason : reason
}, 'POST','api');

// 根据机构id获取打款信息
export const getAccountInfo = (id) => fetch('/admin/store/getStoreAccountInfo', {id : id}, 'GET','api');

// 打款
export const addAccount = (id,status,money) => fetch('/admin/store/bankInfoAudit', {
    id : id,
    status : status,
    remitMoney : money
}, 'POST','api');










//会员
export const getMember = (phone,page) => fetch('/member', {
	phone:phone,
	page:page,
	size:10,
}, 'GET','api');
export const getDetail = (id) => fetch('/member/getDetail', {
	id:id,
}, 'GET','api');
export const getRegister = (active,phone) => fetch('/member/register', {
	active:active,
	phone:phone,
}, 'POST','api');
export const getsendNote = (phone) => fetch('/member/sendNote', {
	phone:phone,
}, 'GET','api');


//服务
export const commodityInfo = (commodityName,storeName,page) => fetch('/commodity/info', {
	commodityName:commodityName,
	storeName:storeName,
	page:page,
	size:10,
}, 'GET','api');
export const commodityInfodel = (id,reason) => fetch('/commodity/info/del', {
	id:id,
	reason:reason,
}, 'PUT','api');

//结算
export const getSettlelist = (month,page,size) => fetch('/settle/info', {
    month : month || '',
    page : page || 1,
    size : size || 10,
}, 'GET','api');

// 结算 已打款
export const changeSettle = (id) => fetch('/settle/info/pay', {settleId : id}, 'PUT','api');

// 结算 查看详情
export const getSettleDetail = (id) => fetch('/settle/info/'+id, {}, 'GET','api');

// 发票
export const getInvoicelist = (month,page,size) => fetch('/invoice/record', {
    month : month || '',
    page : page || 1,
    size : size || 10,
}, 'GET','api');

// 填写快递
export const addExpress = (value) => fetch('/invoice/record/express', value, 'POST','api');

// 查看发票详情
export const getInvoiceDetail = (id) => fetch('/invoice/record/'+id, {}, 'GET','api');





// 设置
// 获取操作员列表
export const getUserlist = (page,size) => fetch('/admin/user/list', {
    page : page || 1,
    size : size || 10,
}, 'GET','api');

// 删除操作员
export const deleteUser = (value) => fetch('/admin/user/delete', {
    list : value
}, 'DELETE','api');

// 添加、编辑操作员
export const editUser = (username,roleid,id) => fetch('/admin/user/addOrUpdateUser', {
    userName: username,
    roleId : roleid,
    id: id,
}, 'PUT','api');

// 查看操作员
export const getUserinfo = (id) => fetch('/admin/user/getUserDetail', {
    id : id
}, 'GET','api');


// 获取权限组列表
export const getRolelist = (page,size) => fetch('/admin/role/rolelist', {
    page : page || 1,
    size : size || 10,
}, 'GET','api');

export const getAllRolelist = () => fetch('/admin/role/rolelist', {}, 'GET','api');

// 删除权限组
export const deleteRole = (value) => fetch('/admin/role/delRole', {
    list : value
}, 'DELETE','api');

// 获取权限组功能设置列表
export const getPrdtreelist = () => fetch('/admin/role/getAllPers', {}, 'GET','api');

// 根据角色id查询用户的角色权限
export const getRolepower = (id) => fetch('/admin/role/roleAndPers', {id : id}, 'GET','api');

// 新增权限组
export const addRolepower = (name,arr) => fetch('/admin/role/addRole',{
    roleName : name,
    permIds : arr
}, 'POST','api');

// 编辑权限组
export const editRolepower = (id,name,arr) => fetch('/admin/role/updateRole',{
    roleid : id,
    roleName : name,
    permIds : arr
}, 'PUT','api');




// 统一设置列表
export const systemSetlist = (page,size) => fetch('/admin/sysset', {
    page : page || 1,
    size : size || 10,
}, 'GET','api');

// 修改统一设置信息
export const updateSystemSet = (value) => fetch('/admin/sysset', value, 'PUT','api');










export const getOrderList = (user_id, offset) => fetch('/bos/v2/users/' + user_id + '/orders', {
	limit: 10,
	offset,
});

//订单
export const getiOrderList = (orderInfo) => fetch('/iOrder/iOrderList', {
  orderCode: orderInfo.orderCode,
  orderTimeBegin: orderInfo.orderTimeBegin,
  orderTimeEnd: orderInfo.orderTimeEnd,
  page: orderInfo.page,
  phone: orderInfo.phone,
  size: orderInfo.size,
  storeName: orderInfo.storeName,
  typeId: orderInfo.typeId
},'GET','api');

//订单详情
export const getiOrderDetails = (id) => fetch('/iOrder/iOrderDetails', {
  id: id
},'GET','api');

//收到货款
export const paymentDeal = (iOrderDealPaymentFormBean) => fetch('/iOrder/paymentDeal',iOrderDealPaymentFormBean,'POST','api');

//下载报告单
export const downLoadReport = (iOrderId) => {  return process.env.API_HOST+'/iOrder/downLoadReport?iOrderId='+iOrderId+'&token='+store.getters.getToken};

//下载委托书
export const downEntrust = (id) => {  return process.env.API_HOST+'/iOrder/downEntrust?id='+id+'&token='+store.getters.getToken};

//预览委托书
export const showEntrust = (id) => {  return process.env.API_HOST+'/iOrder/showEntrust?id='+id+'&token='+store.getters.getToken};
