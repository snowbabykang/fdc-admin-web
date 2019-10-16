<template>
<section>
    <organDetailBtn :currentStep="4"/>
    <section v-if="info">
        <section class="content-white-box">
            <div class="big-border-title">打款信息</div>
            <a-row type="flex" align="bottom">
                <a-col :span="16">
                    <a-form :form="form" class="form-item-label-left">
                        <a-form-item v-bind="formItemLayout" label="开户银行城市">{{info.provinceName}} {{info.cityName}} {{info.areaName}}</a-form-item>
                        <a-form-item v-bind="formItemLayout" label="银行名称">{{info.bankName}}</a-form-item>
                        <a-form-item v-bind="formItemLayout" label="开户银行账号">{{info.accountNumber}}</a-form-item>
                        <a-form-item v-bind="formItemLayout" label="开户银行">{{info.bankOpening}} </a-form-item>
                        <a-form-item v-bind="formItemLayout" label="打款信息">
                            <div v-if="info.status == 0 || info.status == 3">
                                <a-input-number v-decorator="['remitMoney',{rules: [{ required: true, message: '请输入价格' }]}]" :min="0.01" :max="1" :precision="2" placeholder="请输入"/>
                                <span class="unit">元</span>
                            </div>
                            <div v-else><span v-if="info.remitMoney !== null">{{info.remitMoney}}元</span></div>
                        </a-form-item>
                    </a-form>
                </a-col>
                <a-col :span="8">
                    <div class="text-right" v-if="checkPower()">
                        <a-button type="primary" v-if="info.status == 0 || info.status == 3" @click="handleSubmit">确认打款</a-button>
                    </div>  
                </a-col>
            </a-row>
        </section>
        <organStatus :status="info" :type="4" />
    </section>
    <section  v-else class="content-white-box">
        <noData />
    </section>
</section>
</template>
<script>
import noData from '../components/noData'
import organDetailBtn from "../components/organDetailBtn"
import organStatus from "../components/organStatus"
import {getAccountInfo, addAccount} from '@/service/getData'
export default {
    data() {
        return {
            id : this.$route.params.id,
            info : {},
            formItemLayout: {
                labelCol: { span: 5 },
                wrapperCol: { span: 18 },
            },
            payment : '',
        };
    },
    components : {
        noData,organDetailBtn,organStatus
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    methods : {
        handleSubmit(){
            let that = this;
            this.form.validateFields((err, values) => {
                if (!err) {
                    this.$confirm({
                        title: '确定打款吗？',
                        onOk() {
                            addAccount(that.info.id,1,values.remitMoney).then((res) => {
                                if(res && res.code == 200){
                                    that.init();
                                }
                            })
                        },
                    });
                }
            });
        },
        init(){
            getAccountInfo(this.id).then((res) => {
                if(res && res.code == 200){
                    this.info = res.data;
                }
            })
        }
    },
    mounted(){
        this.init();
    }
};
</script>
<style type="text/css" scoped>
.form-item-label-left{
    padding-left: 11px;
}
.form-item-label-left .ant-row{
    margin-bottom: 0px;
}
.unit{
    padding-left: 12px;
}
</style>