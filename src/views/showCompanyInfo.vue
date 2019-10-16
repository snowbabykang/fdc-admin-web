<template>
<section>
    <organDetailBtn :currentStep="1"/>
    <section v-if="info && info.id">
        <section class="content-white-box">
            <div class="big-border-title">公司信息</div>
            <a-form class="form-item-label-left">
                <a-form-item v-bind="formItemLayout" label="营业执照">
                    <div class="previewImgbox" @click="handlePreview(info.licenseimg)">
                        <div class="imgbox"><img :src="info.licenseimg"></div>
                        <div class="showbigbtn">查看大图</div>
                    </div>  
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="公司名称">{{info.orgName}}</a-form-item>
                <a-form-item v-bind="formItemLayout" label="社会信息代码">{{info.socialCode}}</a-form-item>
                <a-form-item v-bind="formItemLayout" label="注册电话">{{info.regPhone}} </a-form-item>
                <a-form-item v-bind="formItemLayout" label="邮箱地址">{{info.email}} </a-form-item>
            </a-form>
        </section>
        <section class="content-white-box">
            <div class="big-border-title">法人信息</div>
            <a-form class="form-item-label-left">
                <a-form-item v-bind="formItemLayout" label="印章照片">
                    <div class="previewImgbox" @click="handlePreview(info.signimg)">
                        <div class="imgbox"><img :src="info.signimg"></div>
                        <div class="showbigbtn">查看大图</div>
                    </div>  
                </a-form-item>
                <a-form-item v-bind="formItemLayout" label="法人代表">{{info.legalName}}</a-form-item>
                <a-form-item v-bind="formItemLayout" label="法人身份证/护照号">{{info.legalId}} </a-form-item>
                <a-form-item v-bind="formItemLayout" label="法人代表联系电话">{{info.legalPhone}} </a-form-item>
                <div class="clause-box">已同意《服务条款》和《隐私权相关政策》</div>
            </a-form>
        </section>
        <section class="content-white-box" v-if="info.systemSetting.status == 0">
            <div class="big-border-title">佣金比例 </div>
            <div><span style="font-weight: 500;padding: 0 40px 0 11px;">佣金比例：</span> {{info.systemSetting.settingValue}}%</div>
        </section>
        <organStatus :status="info" :type="1"/>
        <!-- 查看大图 -->
        <sourceImgModal :visible.sync="previewVisible"  :img="previewImage"/>
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
import sourceImgModal from "../components/sourceImgModal"
import {getCompanyInfo} from '@/service/getData'
import { checkStatus,statusClass } from '../api/dictionary'
export default {
    data() {
        return {
            id : this.$route.params.id,
            info : {},
            formItemLayout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 18 },
            },
            previewVisible: false,
            previewImage: '',
            checkStatus : checkStatus,
            statusClass : statusClass,
        };
    },
    components : {
        noData,organDetailBtn,organStatus,sourceImgModal
    },
    methods : {
        handlePreview (img) {
            this.previewImage = img;
            if(img){
                this.previewVisible = true;
            }
        },
    },
    mounted(){
        getCompanyInfo(this.id).then((res) => {
            if(res && res.code == 200){
                this.info = res.data;
                for(var i =0; i < res.data.fileUrls.length; i++){
                    if(res.data.fileUrls[i].fileType == 1){
                        this.info.licenseimg = res.data.fileUrls[i].fileUrl;
                    }else if(res.data.fileUrls[i].fileType == 2){
                        this.info.signimg = res.data.fileUrls[i].fileUrl;
                        
                    }
                }
            }
        })
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
.clause-box{
    height:64px;
    background:rgba(250,250,250,1);
    line-height: 64px;
    padding-left: 16px;
}
/*.statuslist{
    color:rgba(0,0,0,0.65);
    line-height: 1;
    padding-left: 11px;
}
.statuslist .status_title{
    font-weight:500;
    color:rgba(0,0,0,0.65);
    font-size: 16px;
}
.statuslist .ant-row{
    padding-bottom: 22px;
}*/
</style>