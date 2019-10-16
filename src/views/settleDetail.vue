<template>
<section class="content-white-box">
    <div class="big-border-title">账单信息</div>
    <table class="settleTb">
        <tr>
            <td><span class="title">账单编号：</span>{{data.settleCode}}</td>
            <td><span class="title">协议佣金比例：</span> <span v-if="data.commissionRatio">{{data.commissionRatio}}%</span></td>
            <td colspan="2"></td>
        </tr>
        <tr>
            <td width="27%"><span class="title">开始日期：</span>{{data.startDate}}</td>
            <td width="27%"><span class="title">结束日期：</span>{{data.completeDate}}</td>
            <td width="27%"><span class="title">出账日期：</span>{{data.expendTime}}</td>
            <td width="19%"><span class="title">账单状态：</span>{{statusArr[data.status]}}</td>
        </tr>
    </table>
    <a-table  style="border:1px solid #e8e8e8; border-bottom: none;"
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="data.list"
        :loading="loading"
        :pagination="false"
      >
        <template slot="totalPrices" slot-scope="totalPrices"> <span v-if="totalPrices">￥{{totalPrices}} </span></template>
        <template slot="cost" slot-scope="cost"><span v-if="cost"> ￥{{cost}}</span> </template>
        <template slot="typeId" slot-scope="typeId"> {{typeArr[typeId]}}</template>
    </a-table>
    <div class="text-right" style="padding-top: 32px;font-size: 16px;">
        合计：¥ {{data.ammount}} <span style="padding-left: 24px;"></span> 应结：<span class="red">¥ {{data.cost}}</span>
    </div>
</section>     
</template>

<script>
import {getSettleDetail} from '@/service/getData'
const columns = [
    {title: '订单号', dataIndex: 'orderCode', },
    {title: '订单服务', dataIndex: 'commodityName', },
    {title: '下单时间', dataIndex: 'orderTime', },
    {title: '完成时间', dataIndex: 'updateTime', },
    {title: '订单金额', dataIndex: 'totalPrices',scopedSlots: { customRender: 'totalPrices' }, },
    {title: '应结', dataIndex: 'cost',scopedSlots: { customRender: 'cost' }, },
    {title: '状态', dataIndex: 'typeId',scopedSlots: { customRender: 'typeId' }, },
];
export default {
    data () {
        return {
            data: [],
            loading: false,
            columns,
            statusArr : {0 : '待确认',1 : '已确认',2 : '已结算',3 : '未开票',4 : '已开票'},
            typeArr :  {1 : '待付款',2 : '已付款',3 : '已寄样',4 : '已收样',5 : '检测中',6 : '检测完成',7 : '待收货',8 : '已完成',9 : '已取消'},
        }
    },
    methods: {
        async initData(id){
            this.loading = true;
            let res = await getSettleDetail(id);
            if(res && res.code == 200){
                this.data = res.data;
                this.loading = false;
            }
        },
    },
    mounted(){
        this.initData(this.$route.params.id);
    },
    
}
</script>

<style scoped>
.settleTb{
    width: 100%;
    margin-bottom: 16px;
}
.settleTb tr td{
    padding: 0 0 24px 0;
}
.settleTb tr td .title{
    font-size: 16px;
    font-weight: 500;
    display: inline-block;
    width: 114px;
}
</style>
