<template>
    <section class="">
        <psdStep :currentStep="2"></psdStep>
        <a-form layout="horizontal" @submit="handleSubmit" class="verify-form">
            <a-row class="errormsg">
                <a-col :span="6"> </a-col>
                <a-col :span="13">
                    <a-alert v-if="errormsg" class="errormsgbox" type="error" :message="errormsg" closable showIcon :afterClose="handleClose" />
                </a-col>
            </a-row>
            <a-form-item label="设置密码" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                <a-input size="large" type="password" v-model="forminfo.password" @blur="validatePassword"> </a-input>
            </a-form-item>
            <a-form-item label="确认密码" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="psd-form-item">
                <a-input size="large" type="password" v-model="forminfo.confirm" @blur="validateNextPassword"> </a-input>
            </a-form-item>
            <a-form-item style="text-align: center;">
                <a-button type="primary" html-type="submit" size="large" class="submitbtn">确定</a-button> 
            </a-form-item>
        </a-form>
    </section>
</template>
<script>
import psdStep from '../components/psdStep'
import {validateUpdatePsd} from '../api/validateForm.js'
import {Encrypt} from '../api/env'
import {changePsd} from '@/service/getData'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13 },
};
export default {
    data() {
        return {
            formItemLayout,
            forminfo: {
                password: "",
                confirm: "",
            },
            errormsg : "",
        };
    },
    components: {
        psdStep
    },
    methods: {
        handleSubmit  (e) {
            e.preventDefault();
            let phone = this.$store.getters.getAccount == 'admin' ? this.$store.getters.getAccount : this.$store.getters.getPsdPhone;
            this.validatePassword();
            if(!phone) return false;
            if(this.forminfo.password && this.forminfo.confirm && !this.errormsg){
                changePsd(phone,Encrypt(this.forminfo.password)).then(res => {
                    if(res && res.code == 200){
                        this.$store.dispatch('removePsdPhone');
                        this.$router.push('/finishPsd');
                    }
                })
            }
        },
        validatePassword  () {
            let psd = this.forminfo.password;
            let confirmpsd = this.forminfo.confirm;
            if(!psd){
                this.errormsg = "哎呀~！请设置密码";
                return false;
            }
            var msg = validateUpdatePsd(psd);
            if(msg){
                this.errormsg = msg;
                return false;
            }
            if(psd && confirmpsd && psd !== confirmpsd){
                this.errormsg = "哎呀~！两次密码不一样";
                return false;
            }else{
                this.errormsg = "";
            }
        },
        validateNextPassword(){
            let psd = this.forminfo.password;
            let confirmpsd = this.forminfo.confirm;
            if(!confirmpsd ){
                this.errormsg = "哎呀~！请确认密码";
                return false;
            }
            if(psd && confirmpsd && psd !== confirmpsd){
                this.errormsg = "哎呀~！两次密码不一样";
                return false;
            }else{
                this.errormsg = "";
            }
        },
        handleClose(){
            this.errormsg = "";
        },
    },
};
</script>
<style type="text/css" scoped>
.verify-form{
    padding-top: 0.19rem;
}
.verify-form >>> .ant-form-item-label label{
    font-size: 0.07rem;
}
.verify-form .ant-input,.verify-form .ant-btn{
    height: 0.26rem;
    line-height: 0.26rem;
    margin-top: -0.03rem;
    font-size: 0.07rem;
}
.submitbtn,.verifybtn{
    width: 0.74rem;
}
.errormsg{
    height: 0.21rem;
    margin-bottom: 0.05rem;
}
.errormsgbox{
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
.psd-form-item{
    margin: 0.39rem 0 0.46rem;
}
</style>