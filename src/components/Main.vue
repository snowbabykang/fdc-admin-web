<template>
  <a-layout style="left:0;">
    <a-layout-sider>
      <div class="logo">FDC检测管理系统</div>
      <a-menu theme="dark" mode="inline" 
              :openKeys="openKeys" 
              @openChange="onOpenChange" 
              :selectedKeys="selectedKeys"
              @click="select">
        <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
          <a-menu-item :key="item.meta.path" v-if="!item.leaf">
            <router-link :to="item.meta.path" class="routertitle"><a-icon :type="item.iconCls" theme="filled" v-if="item.iconCls"/><span>{{item.meta.title}}</span></router-link>
          </a-menu-item>
          <a-sub-menu :key="item.meta.group" v-if="item.leaf && $store.getters.getMenuPower[index]">
            <span slot="title"><a-icon :type="item.iconCls" theme="filled" v-if="item.iconCls"/><span>{{item.meta.title}}</span></span>
            <a-menu-item :key="submenu.path" v-for="submenu in item.children" v-if="!submenu.hidden && $store.getters.getPower[submenu.meta.powerid] !== undefined ">
              <router-link :to="submenu.path">{{submenu.name}}</router-link>
              }
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="headerbox text-right">
        <div class="usericonbox"><i class="fa fa-user"></i></div>
        <router-link :to="$store.getters.getAccount == 'admin' ? 'resetPsd' : '/verifyIdentity'" class="gray-link updatepsd">修改密码</router-link>
        <span class="gray-link" @click="logout()">退出</span>
      </a-layout-header>
      <a-layout-header class="header-breadcrumb" v-if="$route.path !== '/404'">
        <a-row type="flex" align="middle" :style="{height : '100%'}">
          <a-col :span="24">
            您的位置：
            <a-breadcrumb style="display: inline-block;">
              <a-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{ item.name || item.meta.title}}
              </a-breadcrumb-item>
            </a-breadcrumb>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content :style="{'top':$route.path == '/404' ? '64px' : '128px'}"> 
          <transition v-if="$store.getters.getPower[$route.meta.powerid] !== undefined" name="component-fade" mode="out-in"> <router-view/></transition>
          <noData v-else message="哎呀！你没有权限呀~"/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import {logout} from '@/service/getData'
import noData from '../components/noData'
export default {
    name: 'Main',
    data () {
        return {
          rootSubmenuKeys: [],   //有二级菜单的key值组合
          openKeys: [],         //当前打开哪个二级菜单
          selectedKeys : [],      //当前选中的菜单
          // menupower : this.$store.getters.getMenuPower || {},
          // powerlist : this.$store.getters.getPower || {},
        }
    },
    components : {noData},
    methods: {
      onOpenChange (openKeys) {
        const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.openKeys = openKeys
        } else {
          this.openKeys = latestOpenKey ? [latestOpenKey] : []
        }
      },
      select ({ item, key, selectedKeys }) { // 选中项
        this.selectedKeys = [key];
      },
      logout(){
          logout().then(res => {
              if(res && res.code == 200){
                  this.$store.dispatch('removeToken');
                  this.$store.dispatch('saveAccount','');
                  this.$router.push('/login');
              }
          })
      },
    },
    mounted(){
      this.GLOBAL.getPower();   
    },
    created(){
      let that = this;
      for(let item of that.$router.options.routes){
        if(item.leaf && item.meta.group){
          that.rootSubmenuKeys.push(item.meta.group);
        }
      }
      that.selectedKeys.push(that.$route.meta.index || that.$route.path);
      if(that.$route.matched[0].meta.group){
        that.openKeys.push(that.$route.matched[0].meta.group);
      }
    },
    watch: {
        $route(){
            let that = this;
            that.selectedKeys = [];
            that.selectedKeys.push(that.$route.meta.index || that.$route.path);
        },
    }
}
</script>
<style scoped>
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
.ant-layout-sider{
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  background: #001528;
}
.ant-layout-sider::-webkit-scrollbar {
    width: 2px;     
    height: 1px;
}
.ant-layout-sider::-webkit-scrollbar-thumb {
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #001528;
}
.ant-layout-sider::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #001528;
}
.ant-layout-sider .logo {
  font-size:18px;
  font-weight:600;
  color: #fff;
  line-height: 64px;
  height: 64px;
  text-align: center;
  background: #002140;
}
.ant-menu-dark, .ant-menu-dark .ant-menu-sub{
  background: #001528;
}
.ant-menu-dark >>> .ant-menu-inline.ant-menu-sub{
  background: #000D16;
}
.ant-layout-sider >>> .ant-menu-item,.ant-layout-sider >>> .ant-menu-submenu-title{
  padding-left: 32px!important;
}
.ant-layout-sider >>> .ant-menu-submenu .ant-menu-item{
  padding-left: 57px!important;
}
.ant-layout{
  position: fixed;
  left: 200px;
  right : 0;
  bottom : 0;
  top: 0;
  overflow: hidden;
}
.ant-layout-header{
  position: fixed;
  left: 200px;
  right : 0;
  overflow: hidden;
  background: #fff;
  top: 0;
  padding: 0;
  color: #333333;
  padding: 0 70px 0 23px;
}
.headerbox{
    font-size: 14px;
    box-shadow: 0 1px 7px -3px rgba(0,0,0,0.5);
    z-index: 110;
}
.usericonbox{
    display: inline-block;
    background: #1890FF;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    text-align: center;
    line-height: 30px;
    color: #fff;
    font-size: 18px;
}
.headerbox .updatepsd{
  padding-left: 16px;
  padding-right: 20px;
}
.ant-layout-header.header-breadcrumb{
  top: 64px;
  box-shadow: 0 1px 4px -3px rgba(0,0,0,0.25);
  z-index: 100;
  font-size: 14px;
  color: #999999;
}
.header-breadcrumb >>> .ant-breadcrumb-separator{
  margin: 0;
}
.header-breadcrumb >>> .ant-breadcrumb > span:last-child{
  color: #999999;
}
.ant-avatar-image{
  width: 30px;
  height: 30px;
  margin-right: 16px;
}
.ant-layout-content{
  position: fixed;
  left: 200px;
  right : 0;
  bottom : 0;
  top : 128px;
  background: #F2F2F2;
  padding: 24px;
  overflow: auto;
}
.ant-layout-content::-webkit-scrollbar {
    width: 4px;     
    height: 1px;
}
.ant-layout-content::-webkit-scrollbar-thumb {
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #535353;
}
.ant-layout-content::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #EDEDED;
}
.routertitle{
  color: rgba(255, 255, 255, 0.65);
}
.ant-menu-item-active .routertitle{
  color: #fff;
}
</style>