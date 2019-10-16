<template>
<section>
    <settleInvoice :currentStep="2" @search="search"/> 
    <section class="content-white-box">
        <a-table :columns="columns"
            :rowKey="record => record.id"
            :dataSource="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <span slot="status" slot-scope="status">
                {{statusArr[status]}}
            </span>
            <span slot="action" slot-scope="record">
                <span class="btn-link" @click="showDetail(record.id)">查看</span>
                <span v-if="record.status == 3 && checkPower()" class="btn-link" @click="addExpress(record.id)">填写快递</span>
            </span>
        </a-table>
    </section>  
    <!-- 填写快递 -->
    <a-modal v-model="expressvisible" :footer="null" :zIndex="1001">
        <a-form :form="form" class="form-item-label-left expressform">
            <a-form-item v-bind="formItemLayout" label="物流公司">
                <a-input v-decorator="['expressCompany', {rules: [{ required: true, message: '请输入物流公司名' }]} ]" placeholder="请输入" maxlength="30"/>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="物流号">
                <a-input v-decorator="['expressNumber', {rules: [{ required: true, message: '请输入物流号' }]} ]" placeholder="请输入" maxlength="30"/>
            </a-form-item>
                <div class="text-center submitbtn">
                    <a-button type="primary" ghost @click="handleConfirm">确定</a-button>
                </div>
        </a-form>
    </a-modal> 
    <!-- 查看详情modal -->
    <a-modal v-model="detailvisible" :footer="null" :centered="true" width="100%" :style="{paddingLeft : '224px',paddingRight : '24px'}">
        <div class="expressStatus">
            <div class="title" :style="{paddingBottom : detailInfo.expressNumber ? '' : '64px'}">{{statusArr[detailInfo.status]}} 
                <a-button v-if="detailInfo.status == 3" ghost type="primary" @click="addExpress(detailInfo.id)" style="margin-left: 64px;">填写快递</a-button>
            </div>
            <div class="expressinfo" v-if="detailInfo.expressNumber">发票已邮寄<span style="padding-left: 64px;"></span>{{detailInfo.expressCompany}}：<span class="expresscode">{{detailInfo.expressNumber}}</span></div>
        </div>
        <a-row :gutter="12" type="flex">
            <a-col :span="12">
                <div class="invoicebox">
                    <div class="big-border-title">开票信息</div>
                    <table>
                        <tr> <td width="120">申请开票时间：</td> <td>{{detailInfo.createTime}}</td> </tr>
                        <tr> <td>开票金额：</td> <td class="red">{{detailInfo.amount}}</td> </tr>
                        <tr> <td>发票类型：</td> <td>{{invoiceType[detailInfo.invoiceTypeId]}}</td> </tr>
                        <tr> <td>发票抬头：</td> <td>{{detailInfo.header}}</td> </tr>
                        <tr> <td>纳税人识别号：</td> <td>{{detailInfo.taxerCode}}</td> </tr>
                        <tr v-if="detailInfo.invoiceTypeId == '0'"> <td>开户银行：</td> <td>{{detailInfo.bankName}}</td> </tr>
                        <tr v-if="detailInfo.invoiceTypeId == '0'"> <td>开户账号：</td> <td>{{detailInfo.bankAccount}}</td> </tr>
                        <tr v-if="detailInfo.invoiceTypeId == '0'"> <td>注册场所地址：</td> <td>{{detailInfo.regAddr}}</td> </tr>
                        <tr v-if="detailInfo.invoiceTypeId == '0'"> <td>公司注册电话</td> <td>{{detailInfo.regPhone}}</td> </tr>
                    </table>
                </div>
            </a-col>
            <a-col :span="12">
                <div class="invoicebox">
                    <div class="big-border-title">邮寄信息</div>
                    <table>
                        <tr> <td width="120">发票邮寄地址：</td> <td>{{detailInfo.detailAddress}}</td> </tr>
                        <tr> <td>邮编：</td> <td>{{detailInfo.postCode}}</td> </tr>
                        <tr> <td>联系人姓名：</td> <td>{{detailInfo.contactName}}</td> </tr>
                        <tr> <td>联系电话</td> <td>{{detailInfo.contactPhone}}</td> </tr>
                    </table>
                </div>
            </a-col>
        </a-row>
    </a-modal>
</section>
</template>

<script>
import settleInvoice from "../components/settleInvoice"
import {getInvoicelist, getInvoiceDetail, addExpress} from '@/service/getData'
import { invoiceType, invoiceStatus } from '../api/dictionary'
const columns = [
    {title: '店铺', dataIndex: 'storeName', },
    {title: '申请日期', dataIndex: 'applicationTime', },
    {title: '开票金额（元）', dataIndex: 'amount', },
    {title: '状态', dataIndex: 'status',scopedSlots: { customRender: 'status' }, },
    {title: '操作', key: 'action',scopedSlots: { customRender: 'action' }, }
];
export default {
    data () {
        return {
            data: [],
            pagination: {},
            loading: false,
            columns,
            month : '',
            pagesize : 10,
            expressvisible : false,
            formItemLayout: {
                labelCol: { span: 6 },
                wrapperCol: { span: 16 },
            },
            detailvisible : false,
            detailInfo : '',
            statusArr : invoiceStatus,
            invoiceType : invoiceType,
        }
    },
    components : {
        settleInvoice
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    methods: {
        async initData(month,page,size){
            this.loading = true;
            let res = await getInvoicelist(month,page,size);
            if(res && res.code == 200){
                const pagination = { ...this.pagination };
                pagination.total = res.data.total;
                pagination.pageSize = size;
                this.loading = false;
                this.data = res.data.list;
                this.pagination = pagination;
            }
        },
        handleTableChange (pagination) {
            const pager = { ...this.pagination };
            pager.current = pagination.current;
            this.pagination = pager;
            this.initData(this.month,pagination.current,this.pagesize);
        },
        search(val){
            this.month = val;
            this.pagination.current = 1;
            this.handleTableChange(this.pagination);
        },
        addExpress(id){
            this.expressvisible = true;
            this.form.resetFields();
            this.form.getFieldDecorator('invoiceId', { initialValue: id,preserve : true});
        },  
        handleConfirm(){
            this.form.validateFields((err, values) => {
                if (!err) {
                    addExpress(values).then((res) => {
                        if(res && res.code == 200){
                            this.expressvisible = false;
                            this.detailvisible = false;
                            this.initData(this.month,1,this.pagesize);
                        }
                    })
                }
            });
        },
        showDetail(id){
            getInvoiceDetail(id).then((res) => {
                if(res && res.code == 200){
                    this.detailvisible = true;
                    this.detailInfo = res.data;
                }
            })
        }
        
    },
    mounted(){
        this.initData(this.month,1,this.pagesize);
    },
    
}
</script>

<style scoped>
.expressform{
    padding: 40px 0 8px;
}
.submitbtn{
    margin-top: 64px;
}
.invoicebox{
    background:rgba(0,0,0,0.03);
    padding: 22px 16px 10px 16px;
    height: 100%;
}
.invoicebox .big-border-title{
    margin-bottom: 12px;
}
.expressStatus{}
.expressStatus .title{
    font-size:20px;
    font-weight:500;
}
.expressStatus .expressinfo{
    font-size:16px;
    font-weight:500;
    padding: 14px 0 26px;
}
.expressStatus .expresscode{
    font-size: 14px;
    font-weight: normal;
}
.invoicebox table{
    width: 100%;
}
.invoicebox table tr td{
    font-size:14px;
    font-weight:normal;
    padding: 8px 0px 8px 8px;
    vertical-align: top;
}
.invoicebox table tr td:first-child{
    font-size:16px;
    font-weight:500;
}
.btn-link{
    padding: 0 12px;
}
</style>
