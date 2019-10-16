import Router from 'vue-router'

import Main from '../components/Main.vue'
import subMain from '../components/submain.vue'
import forgetPsdMain from '../components/forgetPsdMain'
const NotFound = () => import(/* webpackChunkName: "index" */ '../components/404')
const Login = () => import(/* webpackChunkName: "index" */ '../views/login')
const verifyIdentity = () => import(/* webpackChunkName: "index" */ '../views/verifyIdentity')
const resetPsd = () => import(/* webpackChunkName: "index" */ '../views/resetPsd')
const finishPsd = () => import(/* webpackChunkName: "index" */ '../views/finishPsd')

const memberManage = () => import(/* webpackChunkName: "index" */ '../views/memberManage')
const memberDetail = () => import(/* webpackChunkName: "index" */ '../views/memberDetail')

const serivceManage = () => import(/* webpackChunkName: "index" */ '../views/serivceManage')
const categoryManage = () => import(/* webpackChunkName: "index" */ '../views/categoryManage')

const shopManage = () => import(/* webpackChunkName: "shop" */ '../views/shopManage')
const companyIdentify = () => import(/* webpackChunkName: "shop" */ '../views/companyIdentify')
const qualityIdentify = () => import(/* webpackChunkName: "shop" */ '../views/qualityIdentify')
const showCompanyInfo = () => import(/* webpackChunkName: "shop" */ '../views/showCompanyInfo')
const qualityCheck = () => import(/* webpackChunkName: "shop" */ '../views/qualityCheck')
const cashDeposit = () => import(/* webpackChunkName: "shop" */ '../views/cashDeposit')
const moneyInformation = () => import(/* webpackChunkName: "shop" */ '../views/moneyInformation')

const order = () => import(/* webpackChunkName: "order" */ '../views/order')
const orderDetail = () => import(/* webpackChunkName: "order" */ '../views/orderDetail')

const settle = () => import(/* webpackChunkName: "account" */ '../views/settle')
const settleDetail = () => import(/* webpackChunkName: "account" */ '../views/settleDetail')
const invoiceManage = () => import(/* webpackChunkName: "account" */ '../views/invoiceManage')

const permissionsSet = () => import(/* webpackChunkName: "config" */ '../views/permissionsSet')
const roleSet = () => import(/* webpackChunkName: "config" */ '../views/roleSet')
const unifiedSet = () => import(/* webpackChunkName: "config" */ '../views/unifiedSet')
const addPermissionsSet = () => import(/* webpackChunkName: "config" */ '../views/addPermissionsSet')

Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true    //左侧菜单不展示
    },
    // {
    //     path: '/404',
    //     component: NotFound,
    //     name: '',
    //     hidden: true
    // },
    {
        path: '/forgotpsd',
        component: forgetPsdMain,
        meta: {title: '重置密码' },
        name: '' ,
        hidden: true,
        children: [
            { path: '/verifyIdentity', component: verifyIdentity, name: '验证身份',meta: {title: '验证身份' }},
            { path: '/resetPsd', component: resetPsd, name: '重置密码',meta: {title: '重置密码' }},
            { path: '/finishPsd', component: finishPsd, name: '完成',meta: {title: '重置密码' }},
        ]
    },
    {
        path: '/',
        component: Main,
        meta: {title: '会员' ,path: '/memberManage',group : 1},
        name: '' ,
        iconCls: 'home',
        leaf : true,    //有二级菜单
        children: [
            { path: '/', component: memberManage, name: '会员管理',meta:{powerid : '101'}},
            { path: '/404', component: NotFound, name: '找不到页面',hidden : true},
            { path: '/memberDetail/:id', component: memberDetail, name: '会员查看',hidden : true,meta : {index : '/',powerid : '101'}},
        ]
    },
    {
        path: '/',
        component: Main,
        meta: {title: '服务',path: '/serivceManage',group : 2},     //group导航菜单子菜单模块的key值
        name: '服务' ,
        iconCls: 'heart',
        leaf : true,
        children: [
            { path: '/serivceManage', component: serivceManage, name: '服务管理',meta:{powerid : '201'}},
            { path: '/categoryManage', component: categoryManage, name: '类目管理',meta:{powerid : '202'}},
        ]
    },
    {
        path: '/',
        component: Main,
        meta: {title: '机构',path: '/shopManage',group : 3},
        name: '机构' ,
        iconCls: 'shop',
        leaf : true,
        children: [
            { path: '/shopManage', component: subMain, name: '机构管理',meta:{powerid : '301'},
                children: [
                    { path: '/shopManage', component: shopManage, name: '管理',meta:{powerid : '301'}},
                    { path: '/companyIdentify', component: companyIdentify, name: '企业认证',meta : {index : '/shopManage',powerid : '301'}},
                    { path: '/qualityIdentify', component: qualityIdentify, name: '资质认证',meta : {index : '/shopManage',powerid : '301'}},
                    { path: '/showCompanyInfo/:id', component: showCompanyInfo, name: '企业认证查看',meta : {index : '/shopManage',powerid : '301'}},
                    { path: '/qualityCheck/:id', component: qualityCheck, name: '资质审核',meta : {index : '/shopManage',powerid : '301'}},
                    { path: '/cashDeposit/:id', component: cashDeposit, name: '保证金',meta : {index : '/shopManage',powerid : '301'}},
                    { path: '/moneyInformation/:id', component: moneyInformation, name: '打款信息',meta : {index : '/shopManage',powerid : '301'}},
                ]
            },
        ]
    },

    {
      path: '/',
      component: Main,
      meta: {title: '订单',path: '/order',group : 4},
      name: '订单' ,
      iconCls: 'file-text',
      leaf : true,
      children: [
          { path: '/order', component: order, name: '订单管理',meta:{powerid : '401'}},
          { path: '/orderDetail/:id', component: orderDetail, name: '订单详情',hidden : true,meta : {index : '/order',powerid : '401'}},
      ]
    },
    {
      path: '/',
      component: Main,
      meta: {title: '结算',path: '/settle',group : 5},
      name: '结算' ,
      iconCls: 'file-text',
      leaf : true,
      children: [
          { path: '/settle', component: settle, name: '结算管理',meta:{powerid : '501'}},
          { path: '/settleDetail/:id', component: settleDetail, name: '结算单查看',hidden : true,meta : {index : '/settle',powerid : '501'}},
          { path: '/invoiceManage', component: invoiceManage, name: '发票管理',hidden : true,meta : {index : '/settle',powerid : '501'}},
      ]
    },
    {
      path: '/',
      component: Main,
      meta: {title: '设置',path: '/permissionsSet',group : 6},
      name: '设置' ,
      iconCls: 'setting',
      leaf : true,
      children: [
        { path: '/permissionsSet', component: permissionsSet, name: '权限设置',meta:{powerid : '601'}},
        { path: '/roleSet', component: roleSet, name: '权限组设置', hidden : true,meta : {index : '/permissionsSet',powerid : '601'}},
        { path: '/addPermissionsSet', component: addPermissionsSet, name: '添加权限组', hidden : true,meta : {index : '/permissionsSet',powerid : '601'}},
        { path: '/redactPermissionsSet/:id', component: addPermissionsSet, name: '编辑权限组', hidden : true,meta : {index : '/permissionsSet',powerid : '601'}},
        { path: '/unifiedSet', component: unifiedSet, name: '统一设置',meta:{powerid : '602'}},
      ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
],
});
