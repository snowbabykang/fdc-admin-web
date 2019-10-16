<template>
<section>
    <organDetailBtn :currentStep="2"/>
    <section v-if="info">
        <section class="content-white-box" v-if="info.certificates && info.certificates.length > 0">
            <div class="big-border-title">资质证书</div>
            <div v-for="(item,index) in info.certificates" :key="item.id">
                <div class="content-border-divider" v-if="index !== 0"></div>
                <a-form class="form-item-label-left">
                    <a-form-item v-bind="formItemLayout" :label="item.certType == 0 ? item.certName : '证书电子版'">
                        <div class="previewImgList">
                            <div class="previewImgbox" @click="handlePreview(item.fileUrl)">
                                <div class="imgbox"><img :src="item.fileUrl"></div>
                                <div class="showbigbtn">查看大图</div>
                            </div>  
                        </div>  
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="证件名称" v-if="item.certType == 1">{{item.certName}}</a-form-item>
                    <a-form-item v-bind="formItemLayout" label="证书编号">{{item.certCode}}</a-form-item>
                    <a-form-item v-bind="formItemLayout" label="许可期限">{{item.startDate}}—{{item.dueDate}}</a-form-item>
                </a-form>
            </div>
        </section>
        <section class="content-white-box" v-if="info.equipments">
            <div class="big-border-title">设备资质</div>
            <a-form class="form-item-label-left">
                <a-form-item v-bind="formItemLayout" label="可检测项目">{{info.equipments.delecteItem}}</a-form-item>
                <a-form-item v-bind="formItemLayout" label="主要设备名称">{{info.equipments.equipName}}</a-form-item>
                <a-form-item v-bind="formItemLayout" label="设备图">
                    <div class="previewImgList">
                        <div class="previewImgbox" @click="handlePreview(item.fileUrl)" v-for="(item ,index) in info.equipments.fileUrls" :key="index">
                            <div class="imgbox"><img :src="item.fileUrl"></div>
                            <div class="showbigbtn">查看大图</div>
                        </div>  
                    </div>
                </a-form-item>
            </a-form>
        </section>
        <section class="content-white-box" v-if="info.professors">
            <div class="big-border-title">权威人员</div>
            <div style="padding-left: 11px;">
                <div>权威人数：{{info.professors.length}}人</div>
                <a-row :gutter="20" style="margin-top: -8px;padding-left: 6px;" v-if="info.professors.length > 0">
                    <a-col :span="8" v-for="item in info.professors" :key="item.id">
                        <a-form class="form-item-label-left user-item-box">
                            <a-form-item v-bind="formItemLayout2" label="姓名">{{item.professorName}}</a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="身份证号">{{item.card}} </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="资质名称">{{item.qualificationName}} </a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="证书编码"><span class="breakword">{{item.certCode}}</span></a-form-item>
                            <a-form-item v-bind="formItemLayout2" label="证书">
                                <div class="previewImgList">
                                    <div class="previewImgbox" @click="handlePreview(item.fileUrl)">
                                        <div class="imgbox"><img :src="item.fileUrl"></div>
                                        <div class="showbigbtn">查看大图</div>
                                    </div>  
                                </div>
                            </a-form-item>
                        </a-form>
                    </a-col>
                </a-row>
            </div>
        </section>
        <section class="content-white-box" v-for="(item,index) in info.factories" :key="item.id">
            <div class="big-border-title" v-if="item.factoryType == 0">工商场地</div>
            <div class="big-border-title" v-if="item.factoryType == 1 && index == 1">分支机构与及分布</div>
            <a-form class="form-item-label-left">
                <a-form-item v-bind="formItemLayout" label="工商场地地址">{{item.provinceName}} {{item.cityName}} {{item.areaName}}</a-form-item>
                <a-form-item v-bind="formItemLayout" label="详细地址">{{item.detailAddr}}</a-form-item>
                <a-form-item v-bind="formItemLayout" label="场地图">
                    <div class="previewImgList">
                        <div class="previewImgbox" @click="handlePreview(k.fileUrl)" v-for="(k ,j) in item.fileUrls" :key="j">
                            <div class="imgbox"><img :src="k.fileUrl"></div>
                            <div class="showbigbtn">查看大图</div>
                        </div>  
                    </div>
                </a-form-item>
            </a-form>
        </section>
        <section class="content-white-box">
            <div class="big-border-title">确认授权</div>
            <a-form class="form-item-label-left">
                <a-form-item v-bind="formItemLayout" label="授权书" v-if="info.storeEms">
                    <div class="previewImgList">
                        <!-- <div class="previewImgbox" @click="handlePreview(info.storeEms.fileUrl)">
                            <div class="imgbox"><img :src="info.storeEms.fileUrl"></div>
                            <div class="showbigbtn">查看大图</div>
                        </div>   -->
                        <!-- <iframe :src="info.storeEms.fileUrl" id='iframebox' ref='pdfiframe' width='200' height="200" frameborder="0" scrolling="no"></iframe> -->
                        <a-button type="primary" @click="showPdf(info.storeEms.fileUrl)">查看委托书</a-button>
                    </div>  
                </a-form-item>
            </a-form>
        </section>
        <organStatus :status="info.orgQualification" :type="2"/>
        <div v-if="checkPower()">
        <section class="content-white-box" v-if="info.orgQualification && info.orgQualification.status !== 1">
            <div class="text-center btnlist">
                <a-button type="primary" @click="confirm">通过</a-button>
                <a-button type="primary" ghost @click="refuse">拒绝</a-button>
            </div>
        </section>
        </div>
        <!-- 查看大图 -->
        <sourceImgModal :visible.sync="previewVisible"  :img="previewImage"/>
        <refuseModal :visible.sync="refuseVisible" @confirm="confirmRefuse" />
        <a-modal v-model="pdfvisible" :footer="null" :width="600" centered>
            <iframe :src="pdfUrl" width="100%" height="600" frameborder="0" scrolling="no"></iframe>
        </a-modal>
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
import {getOrgAuth,auditOrgAuth} from '@/service/getData'
export default {
    data() {
        return {
            id : this.$route.params.id,
            info : {},
            formItemLayout: {
                labelCol: { span: 3 },
                wrapperCol: { span: 18 },
            },
            formItemLayout2: {
                labelCol: { span: 8 },
                wrapperCol: { span: 12 },
            },
            previewVisible: false,
            previewImage: '',
            refuseVisible : false,
            pdfvisible : false,
            pdfUrl : ''
        };
    },
    components : {
        noData,organDetailBtn,refuseModal,organStatus,sourceImgModal
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
                title: '确定已通过',
                onOk() {
                    let emId = that.info.storeEms ? that.info.storeEms.emId : '';
                    auditOrgAuth(emId, that.id, that.info.orgQualification.id,1).then((res) => {
                        if(res && res.code == 200){
                            that.init();
                        }
                    })
                },
            });
        },
        refuse(){
            this.refuseVisible = true;
        },
        confirmRefuse(value){
            let that = this;
            let emId = that.info.storeEms ? that.info.storeEms.emId : '';
            auditOrgAuth(emId, that.id, that.info.orgQualification.id, 2, value.reason).then((res) => {
                if(res && res.code == 200){
                    this.init();
                }
            })
        },
        init(){
            getOrgAuth(this.id).then((res) => {
                if(res && res.code == 200){
                    this.info = res.data;
                }
            })
        },
        showPdf(url){
            this.pdfvisible = true;
            this.pdfUrl = url;
        }
    },
    mounted(){
        this.init();
    }

};
</script>
<style type="text/css" scoped>
.btnlist .ant-btn{
    margin: 0 20px;
}
.content-border-divider{
    height: 1px;
    background: #eee;
    margin: 32px -32px;
}
.form-item-label-left{
    padding-left: 11px;
}
.form-item-label-left .ant-row{
    margin-bottom: 0px;
}
.previewImgList .previewImgbox{
    margin: 12px 32px 0 0;
}
.user-item-box{
    background: #eee;
    border-radius:4px;
    padding: 32px;
    margin-top: 32px;
}
</style>