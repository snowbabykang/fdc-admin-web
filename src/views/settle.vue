<template>
<section>
    <settleInvoice :currentStep="1" @search="search" />    
    <section class="content-white-box">
        <a-table :columns="columns"
            :rowKey="record => record.settleId"
            :dataSource="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <template slot="expandedRowRender" slot-scope="record">
                <table class="expanderTb">
                    <tr>
                        <td>账单编号</td>
                        <td>开始日期</td>
                        <td>结束日期</td>
                        <td>订单金额</td>
                        <td>佣金金额</td>
                        <td>本期应结</td>
                        <td>出账日期</td>
                    </tr>
                    <tr>
                        <td>{{record.settleCode}}</td>
                        <td>{{record.startTime}}</td>
                        <td>{{record.endTime}}</td>
                        <td><span v-if="record.amount">￥</span>{{record.amount}}</td>
                        <td><span v-if="record.comission">￥</span>{{record.comission}}</td>
                        <td><span v-if="record.summaryPeriodSettleAmount">￥</span>{{record.summaryPeriodSettleAmount}}</td>
                        <td>{{record.expendTime}}</td>
                    </tr>
                </table>
            </template>
            <template slot="settleAmount" slot-scope="settleAmount"> 
                <span v-if="settleAmount">￥{{settleAmount}}</span>
            </template>
            <template slot="commissionRatio" slot-scope="commissionRatio">
                <span v-if="commissionRatio"> {{commissionRatio}}%</span>
            </template>
            <template slot="periodSettleAmount" slot-scope="periodSettleAmount"> 
                <span v-if="periodSettleAmount">￥{{periodSettleAmount}}</span></template>
            <template slot="status" slot-scope="status"> {{statusArr[status]}}</template>
            <span slot="action" slot-scope="record">
                <router-link class="btn-link" :to="'/settleDetail/'+record.settleId">查看</router-link>
                <span v-if="record.status == 1 && checkPower()" class="btn-link" @click="changePay(record.settleId)">已打款</span>
            </span>
        </a-table>
    </section>     
</section>
</template>

<script>
import settleInvoice from "../components/settleInvoice"
import {getSettlelist, changeSettle} from '@/service/getData'
const columns = [
    {title: '店铺', dataIndex: 'storeName', },
    {title: '申请日期', dataIndex: 'applicationTime', },
    {title: '金额', dataIndex: 'settleAmount', scopedSlots: { customRender: 'settleAmount' }},
    {title: '收取佣金', dataIndex: 'commissionRatio', scopedSlots: { customRender: 'commissionRatio' } },
    {title: '到账金额', dataIndex: 'periodSettleAmount',scopedSlots: { customRender: 'periodSettleAmount' } },
    {title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' }},
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
            statusArr : {0 : '待确认',1 : '已确认',2 : '已结算',3 : '未开票',4 : '已开票'}
        }
    },
    components : {
        settleInvoice
    },
    methods: {
        async initData(month,page,size){
            this.loading = true;
            let res = await getSettlelist(month,page,size);
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
        changePay(id){
            let that = this;
            this.$confirm({
                title: '确认已打款？',
                onOk() {
                    changeSettle(id).then((res) => {
                        if(res && res.code == 200){
                            that.initData(that.month,1,that.pagesize);
                        }
                    })
                },
            });
        }
    },
    mounted(){
        this.initData(this.month,1,this.pagesize);
    },
    
}
</script>

<style scoped>
.btn-link{
    padding: 0 12px;
}
.expanderTb{
    width: 100%;
}
.expanderTb tr:first-child td{
    padding-bottom: 22px;
}
</style>
