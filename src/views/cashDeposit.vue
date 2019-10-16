<template>
<section>
    <organDetailBtn :currentStep="3"/>
    <section v-if="info">
        <section class="content-white-box">
            <div class="big-border-title">保证金</div>
            <a-form class="form-item-label-left">
                <a-form-item v-bind="formItemLayout" label="打款时间">{{info.paymentTime}}</a-form-item>
                <a-form-item v-bind="formItemLayout" label="凭证">
                    <div class="previewImgbox" @click="handlePreview(info.fileUrl)">
                        <div class="imgbox"><img :src="info.fileUrl"></div>
                        <div class="showbigbtn">查看大图</div>
                    </div>  
                </a-form-item>
            </a-form>
            <!-- 查看大图 -->
            <sourceImgModal :visible.sync="previewVisible" :img="previewImage"/>
        </section>
        <organStatus :status="info" :type="3" />
        <section class="content-white-box" v-if="info.status !== 1 && checkPower()">
            <div class="text-center btnlist">
                <a-button type="primary" @click="confirm">已收到</a-button>
                <a-button type="primary" ghost @click="refuse">未收到</a-button>
            </div>
        </section>
        <refuseModal :visible.sync="refuseVisible" @confirm="confirmRefuse" />
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
import refuseModal from "../components/refuseModal"
import sourceImgModal from "../components/sourceImgModal"
import {getMargin,auditMargin} from '@/service/getData'
export default {
    data() {
        return {
            id : this.$route.params.id,
            info : {},
            formItemLayout: {
                labelCol: { span: 3 },
                wrapperCol: { span: 18 },
            },
            previewVisible: false,
            previewImage: '',
            refuseVisible : false,
        };
    },
    components : {
        noData,organDetailBtn,organStatus,refuseModal,sourceImgModal
    },
    methods : {
        handlePreview (img) {
            this.previewImage = img;
            if(img){
                this.previewVisible = true;
            }
        },
        confirm(){
            let that = this;
            this.$confirm({
                title: '确定已收到',
                onOk() {
                    auditMargin(that.info.id,1,that.info.storeId).then((res) => {
                        if(res && res.code == 200){
                            that.getinfo();
                        }
                    })
                },
            });
        },
        refuse(){
            this.refuseVisible = true;
        },
        confirmRefuse(value){
            auditMargin(this.info.id,2,this.info.storeId,value.reason).then((res) => {
                if(res && res.code == 200){
                    this.getinfo();
                }
            })
        },
        getinfo(){
            getMargin(this.id).then((res) => {
                if(res && res.code == 200){
                    this.info = res.data;
                }
            })
        }
    },
    mounted(){
        this.getinfo();
    }
};
</script>
<style type="text/css" scoped>
.form-item-label-left{
    padding-left: 11px;
}
.btnlist .ant-btn{
    margin: 0 20px;
}
</style>