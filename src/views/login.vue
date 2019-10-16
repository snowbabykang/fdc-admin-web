<template>
    <div class="loginfixed">
        <div class="loginbox">
           <!--  <div class="errormsgbox">
                <a-icon type="close-circle" theme="filled"></a-icon>
                <span class="description">{{errormsg}}</span>
                <a-icon type="close" ></a-icon>

            </div> -->
            <a-alert class="errormsgbox" v-if="errormsg" type="error" :message="errormsg" closable showIcon :afterClose="handleClose" />
            <a-form layout="horizontal" @submit="handleSubmit" class="login-form">
                <div class="loginlogo"><img src="static/common-img/logo.png" alt=""></div>
                <a-form-item :validate-status="phoneStatus">
                    <a-input size="large" type="text" v-model="forminfo.phone" placeholder="请输入手机号"  @blur="checkPhone">
                        <a-icon slot="prefix" type="user" style=""/>
                    </a-input>
                </a-form-item>
                <a-form-item class="psd-form-item" :validate-status="psdStatus">
                    <a-input size="large" type="password" v-model="forminfo.password" @blur="validatePassword" placeholder="请输入密码">
                        <a-icon slot="prefix" type="lock"/>
                    </a-input>
                </a-form-item>
                <a-form-item class="code-form-item" style="line-height: auto;">
                    <a-row type="flex" align="bottom">
                        <a-col :span="16"  class="imgcodebox">
                            <a-input size="large" type="text" placeholder="校验码" v-model="forminfo.code"></a-input>
                            <img :src="imgCode">
                        </a-col>
                        <a-col :span="8"><div class="changeCode" @click="changeCode()">换一张<a-icon type="sync"/></div></a-col>
                    </a-row>

                    <router-link to="/verifyIdentity" class="gray-link forgotpsd">忘记密码</router-link>
                </a-form-item>
                <a-button type="primary" block class="login-btn" html-type="submit" :disabled="validateAll()">立即登录</a-button>
            </a-form>
        </div>


    </div>
</template>

<script>
import {validatePhone,validateUpdatePsd} from '../api/validateForm.js'
import {Encrypt} from '../api/env'
import {verifyImgCode, login} from '@/service/getData'
const createImgCode = process.env.API_HOST+"/admin/imageCode/createCode";
export default {
    name: 'Login',
    data () {
        return {
            forminfo: {
                phone : "",
                password: "",
                code: "",
            },
            errormsg : "",
            phoneStatus : "",
            psdStatus : "",
            imgCode : createImgCode
        }
    },
    methods: {
        checkPhone(){
            let phone = this.forminfo.phone;
            if(!phone ){
                this.errormsg = "哎呀~！请输入账号";
            }else{
                if(phone.length == 5 && phone == 'admin'){
                    this.errormsg = "";
                }else{
                    this.errormsg = validatePhone(phone);
                }
            }
            this.phoneStatus = this.errormsg ? "error" : "";
            this.validateAll();
        },
        validatePassword  () {
            let psd = this.forminfo.password;
            if(!psd ){
                this.errormsg = "哎呀~！请设置密码";
            }
            this.errormsg = validateUpdatePsd(psd);
            this.psdStatus = this.errormsg ? "error" : "";
            this.validateAll();
        },
        validateAll(){
            if(this.forminfo.phone && this.forminfo.password && this.forminfo.code){
                return false;
            }else{
                return true;
            }
        },
        // 更换验证码
        changeCode(){
            this.imgCode = createImgCode +"?"+Math.random() ;
            this.forminfo.code = '';
        },
        handleSubmit  (e) {
            e.preventDefault();
            let info = this.forminfo;
            verifyImgCode(info.code).then(res => {
                if(res && res.code == 200){
                    login( info.phone, Encrypt(info.password)).then(res => {
                        if(res && res.code == 200){
                            this.$store.dispatch('saveToken',res.data);
                            this.$store.dispatch('saveAccount',info.phone);
                            this.$router.push('/');
                        }
                    })
                }
            })
        },
        handleClose(){
            this.errormsg = "";
        },
    },
    mounted(){
        this.$store.commit('resetState');
    }
}
</script>
<style scoped>
.loginfixed{
    background-image: url('../../static/common-img/loginbg.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.loginbox{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width:2.2rem;
    height:2.4rem;
}
.login-btn{
    width: 100%;
    height: 0.26rem;
    line-height: 0.26rem;
    font-size: 0.11rem;
    text-align: center;
    color: #fff;
    background: #386CFE;
}
.login-btn[disabled]{
    background: #E4E2E4;
}
.loginlogo{
    text-align: center;
    margin-bottom: 0.38rem;
}
.loginlogo img{
    width: 2.13rem;
}

.errormsgbox{
    position: absolute;
    top: 0.5rem;
    width: 100%;
}
.errormsgbox.ant-alert{
    font-size: 12px;
    line-height: 1;
}
.errormsgbox >>> .ant-alert-icon{
    top: 0.055rem;
}
.errormsgbox >>> .ant-alert-close-icon{
    top: 0.025rem;
}
.link-groups .routerlink{
    color: #fff;
    font-size: 0.07rem;
    padding-right: 0.1rem;
}
.changeCode{
    color: #333;
    font-size: 0.06rem;
    line-height: 1.4;
    padding-left: 0.07rem;
    cursor: pointer;
}
.login-form .anticon{
    color: #999;
    font-size: 0.15rem;
}
.psd-form-item{
    margin: 0.21rem 0 0.19rem 0;
}
.code-form-item{
    margin-bottom : 0.19rem;
}
.imgcodebox{
    position: relative;
    height: 0.26rem;
    overflow: hidden;
}
.imgcodebox .ant-input{
    width: 0.77rem;
    position: absolute;
}
.imgcodebox img{
    width: 0.6rem;
    height: 0.26rem;
    position: absolute;
    left: 0.77rem;
}
.changeCode .anticon{
    font-size : inherit;
    padding-left:0.03rem;
}
.login-form >>> .ant-input-affix-wrapper .ant-input-prefix {
    left: 0.06rem;
}
.login-form >>> .ant-input-affix-wrapper .ant-input{
    padding-left:0.23rem;
}
.login-form >>> .ant-input{
    height:0.26rem;font-size: 0.08rem;border-radius: 0;
}
.login-form >>> .ant-input-group-addon{
    width: 0.5rem;
}
.login-form >>> .ant-input-group-addon{
    border-radius: 0;
}
.forgotpsd{
    font-size: 0.07rem;
    color: rgba(0,0,0,0.45);
    display: block;
    line-height: 1;
    padding-top: 0.05rem;
    width: 50%;
}
</style>
