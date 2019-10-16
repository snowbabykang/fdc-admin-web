<template>
  <div>
    <div class="order-manage">
        <span>订单号 </span><a-input placeholder="请输入" v-model="orderInfo.orderCode"/>
        <span>店铺 </span><a-input placeholder="请输入" v-model="orderInfo.storeName"/>
        <span>下单时间 &nbsp;</span><a-range-picker @change="onChange" :getCalendarContainer="GLOBAL.getPopupContainer"/><br /><br />
        <span>需求方 </span><a-input placeholder="请输入" v-model="orderInfo.phone"/>
        <span>订单状态 &nbsp;</span>
        <a-select
          showSearch
          placeholder="请选择"
          optionFilterProp="children"
          style="width: 160px"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          :filterOption="filterOption"
          :getPopupContainer="GLOBAL.getPopupContainer"
        >
          <a-select-option value="">全部</a-select-option>
          <a-select-option :value="item.value" v-for="(item,index) in orderStatusValue" :key="index">{{item.meg}}</a-select-option>
        </a-select>
        <a-button type="primary" ghost class="findOrder" @click="search()">查询</a-button>
    </div>
    <div class="order-table">
        <div class="order-attention">
          <div style="color:red;margin-bottom:14px;">操作提示 :</div>
          <div>· 点击查看操作将显示订单的详细信息<br /><br />· 如果平台已确认收到买家的付款，但系统支付状态并未变更，可以点击收到货款操作，并填写相关信息后更改支付状态</div>
        </div>
        <a-table :columns="columns"
            :rowKey="record => record.id"
            :dataSource="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <span slot="paymentType" slot-scope="paymentType">
                {{paymentTypes[paymentType]}}
            </span>
            <span slot="typeId" slot-scope="typeId">
                {{orderStatus[typeId]}}
            </span>
            <span slot="action" slot-scope="record">
              <router-link :to="'/orderDetail/'+record.id">查看</router-link>
              <a href='javascript:;' v-if="record.typeId == 1 && checkPower()" @click="receipt(record.id)" style="margin-left: 13px;">收到货款</a>
            </span>
        </a-table>
    </div>
    <receipt-modal @confirm="fatherMethod" :visible.sync="showReceiptModel" :orderCode="orderCode" :paymentAmount="paymentAmount" :orderId="orderId"></receipt-modal>
  </div>
</template>

<script>
import receiptModal from '../components/receiptModal'
import {orderStatus,orderStatusValue,paymentTypes} from '../api/dictionary'
import { getiOrderList,getiOrderDetails } from '@/service/getData'

const columns = [{
  title: '订单号',
  dataIndex: 'orderCode',
}, {
  title: '店铺',
  dataIndex: 'storeName',
}, {
  title: '需求方',
  dataIndex: 'phone',
},{
  title: '下单时间',
  dataIndex: 'orderTime',
},{
  title: '订单总额',
  dataIndex: 'totalPrices',
},{
  title: '支付方式',
  dataIndex: 'paymentType',
  scopedSlots: { customRender: 'paymentType' },
},{
  title: '订单状态',
  dataIndex: 'typeId',
  scopedSlots: { customRender: 'typeId' },
},{
  title: '操作',
  key: 'action',
  scopedSlots: { customRender: 'action' },
}];

const data = [];

export default {
  components: {
     receiptModal
  },
  data() {
    return {
      data,
      columns,
      loading: false,
      pagination: {},
      showReceiptModel: false,
      orderStatusValue: orderStatusValue,
      orderStatus: orderStatus,
      paymentTypes: paymentTypes,
      orderInfo: {
        orderCode: '',
        orderTimeBegin: '',
        orderTimeEnd: '',
        page: '',
        phone: '',
        size: 10,
        storeName: '',
        typeId: ''
      },
      paymentAmount: '',
      orderCode: '',
      orderId: ''
    }
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`);
      this.orderInfo.typeId = value;
    },
    handleBlur() {
      console.log('blur');
    },
    handleFocus() {
      console.log('focus');
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    receipt(id){
      getiOrderDetails(id).then(res => {
        if(res && res.code == 200){
          this.orderId = id;
          this.paymentAmount =  res.data.totalPrices;
          this.orderCode =  res.data.orderCode;
          this.showReceiptModel = true;
        }
      })
    },
    onChange(date, dateString) {
      this.orderInfo.orderTimeBegin = dateString[0];
      this.orderInfo.orderTimeEnd =  dateString[1];
    },
    async initData(){
        this.loading = true;
        let res = await getiOrderList(this.orderInfo);
        if(res && res.code == 200){
            const pagination = { ...this.pagination };
            pagination.total = res.data.total;
            pagination.pageSize = this.orderInfo.size;
            this.loading = false;
            this.data = res.data.list;
            this.pagination = pagination;
        }
    },
    handleTableChange (pagination) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.orderInfo.page = pagination.current;
        this.initData();
    },
    search(){
        this.pagination.current = 1;
        this.handleTableChange(this.pagination);
    },
    fatherMethod() {
      this.search();
    }
  },
  mounted(){
    this.initData();
  }
}
</script>
<style scoped>
.ant-input{
    width: 240px;
    margin: 0 8px 8px 8px;
}
.order-attention{
    font-size:12px;
    display: inline-block;
    padding-bottom:21px;
}
.order-manage{
    padding-top:24px;
    padding-left:25px;
    background: white;
    padding-bottom:24px;
}
.order-manage .ant-input{
    margin-right: 42px;
}
.order-manage >>> .ant-calendar-picker-input{
    width: 240px;
}
.findOrder{
    width:74px;
    height:32px;
    margin-left: 42px;
}
.order-table{
    padding-top:20px;
    background:white;
    padding-left:32px;
    padding-right:32px;
    margin-top:10px;
}
</style>
