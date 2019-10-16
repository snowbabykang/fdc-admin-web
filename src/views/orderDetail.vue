<template>
 <section v-if="loading">
    <loading :visible="true"></loading>
 </section>
 <section class="container" v-else-if="data">
    <div class="top flexbox">
      <p>订单编号：<span>{{data.orderCode}}</span></p>
      <p>订单金额：<span style="color: #E6242E;">¥ {{data.totalPrices}}</span></p>
    </div>
    <div class="status borderline" v-if="data.typeId == 1">
       <p class="status-icon"><a-icon type="exclamation-circle" style="color: #FAAD14;"/>待付款</p>
       <a-button type="primary" @click="receipt(data.id)" v-if="checkPower()">确认收款</a-button>
    </div>
    <div class="status borderline" v-if="data.typeId == 2">
       <p class="status-icon"><a-icon type="check-circle" />已付款</p>
       <a-button type="primary" @click="showEntrust()">查看委托书</a-button>
    </div>
    <div class="status borderline status-line" v-if="data.typeId == 3">
       <p class="status-icon"><span class="icon-uniE900"></span>已寄样</p>
    </div>
    <div class="status borderline status-line" v-if="data.typeId == 4">
       <p class="status-icon"><span class="icon-uniE900"></span>已收样</p>
    </div>
    <div class="status borderline status-line" v-if="data.typeId == 5">
       <p class="status-icon"><a-icon type="clock-circle" style="color: #000000;"/>检测中</p>
    </div>
    <div class="status borderline" v-if="data.typeId == 6">
       <p class="status-icon"><a-icon type="check-circle" />检测完成</p>
       <a-button type="primary" @click="getDownLoadReport()">下载报告单</a-button>
    </div>
    <div class="status borderline" v-if="data.typeId == 7">
       <p class="status-icon status-mar"><a-icon type="clock-circle" style="color: #000000;"/>待收单</p>
       <p class="status-cause red">还剩{{countdownTime}}自动确认</p>
    </div>
    <div class="status borderline status-line" v-if="data.typeId == 8">
       <p class="status-icon"><a-icon type="check-circle" />已完成</p>
    </div>
    <div class="status borderline" v-if="data.typeId == 9">
       <p class="status-icon status-mar"><a-icon type="close-circle"  style="color: #E6242E;"/>已取消</p>
       <p class="status-cause">取消原因：{{cancelReasonText[data.cancelReason]}}</p>
    </div>
    <div class="service borderline">
       <div class="title">服务信息</div>
       <table class="service-table">
        <thead>
            <tr>
                <td>项目</td>
                <td width="10%">交期</td>
                <td width="10%">实付款</td>
                <td width="10%">佣金比例</td>
                <td width="10%">总佣金</td>
                <td width="20%">操作</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding-top: 11px;">
                  <span class="service-name" v-for="(item,index) in commodityInfos" :key="index">{{item.commodityTypeName}}</span>
                </td>
                <td>{{isUrgent[data.isUrgent]}}</td>
                <td v-if="data.paymentAmount">¥ {{data.paymentAmount}}</td>
                <td v-else>未付款</td>
                <td>{{data.commissionRate}}%</td>
                <td v-if="data.paymentAmount">¥ {{data.paymentAmount | capitalizePay(data.commissionRate)}}</td>
                <td v-else>未付款</td>
                <td>
                  <a href="javascript:;" class="action-btn" @click="showEntrust()">查看委托书</a>
                  <a href="javascript:;" class="action-btn" v-if="data.typeId >= 6 && data.typeId <= 8" @click="getDownLoadReport()">下载报告单</a>
                </td>
            </tr>
        </tbody>
        <transition name="slide-fade">
            <tbody v-if="showAllProject">
              <tr style="background:rgba(197,194,194,0.15);">
                  <td >单项目</td>
                  <td>单价</td>
                  <td>数量</td>
                  <td>合计</td>
                  <td>佣金</td>
                  <td>实付款</td>
              </tr>
              <tr v-for="(item,index) in commodityInfos" :key="index">
                  <td style="padding-top: 11px;">
                    <span class="service-name">{{item.commodityTypeName}}</span>
                  </td>
                  <td>¥ {{item.urgentPrice}}</td>

                  <td v-if="item.commodityTypeName == '加印报告'">{{item.count}}份</td>
                  <td v-else>{{data.sampleNumber}}份</td>

                  <td v-if="item.commodityTypeName == '加印报告'">¥ {{item.urgentPrice | capitalize(item.count)}}</td>
                  <td v-else>¥ {{item.urgentPrice | capitalize(data.sampleNumber)}}</td>

                  <td v-if="item.commodityTypeName == '加印报告'">¥ {{item.urgentPrice | capitalizeQuantity(item.count,data.commissionRate)}}</td>
                  <td v-else>¥ {{item.urgentPrice | capitalizeQuantity(data.sampleNumber,data.commissionRate)}}</td>

                  <td :rowspan="data.commodityInfos.length" v-if="index == 0 && data.paymentAmount">¥ {{data.paymentAmount}}</td>
                  <td :rowspan="data.commodityInfos.length" v-if="index == 0 && !data.paymentAmount">未付款</td>
              </tr>
          </tbody>
        </transition>
       </table>
       <a-button class="service-allbtn" ghost @click="showAllProMethods()">{{showAllProjectBtn}}</a-button>
    </div>
    <div class="service borderline">
      <div class="title">订单信息</div>
      <a-row class="info">
          <a-col :span="10">
              <a-row type="flex">
                  <a-col class="status_title">委托方：</a-col>
                  <a-col :span="18">{{data.phone}}</a-col>
              </a-row>
              <a-row type="flex">
                  <a-col class="status_title">支付方式：</a-col>
                  <a-col :span="18" v-if="data.paymentType">{{paymentTypes[data.paymentType]}}</a-col>
                  <a-col :span="18" v-else>未付款</a-col>
              </a-row>
          </a-col>
          <a-col :span="14">
              <a-row type="flex">
                  <a-col class="status_title">店铺：</a-col>
                  <a-col :span="18">{{data.storeName}}</a-col>
              </a-row>
              <a-row type="flex">
                  <a-col class="status_title">下单时间：</a-col>
                  <a-col :span="18">{{data.orderTime}}</a-col>
              </a-row>
          </a-col>
      </a-row>
      <div class="title" style="margin-top: 45px;">收货人信息</div>
      <a-row class="info">
          <a-col :span="10">
              <a-row type="flex">
                  <a-col class="status_title">收货人：</a-col>
                  <a-col :span="18">{{orderAddress.contactName}}</a-col>
              </a-row>
              <a-row type="flex">
                  <a-col class="status_title">邮编：</a-col>
                  <a-col :span="18">{{orderAddress.postCode}}</a-col>
              </a-row>
          </a-col>
          <a-col :span="14">
              <a-row type="flex">
                  <a-col class="status_title">电话：</a-col>
                  <a-col :span="18">{{orderAddress.contactPhone}} <span v-if="orderAddress.contactTel">(座机：{{orderAddress.contactTel}})</span> </a-col>
              </a-row>
              <a-row type="flex">
                  <a-col class="status_title">详细地址：</a-col>
                  <a-col :span="18">{{orderAddress.detailAddress}}</a-col>
              </a-row>
          </a-col>
      </a-row>
    </div>
    <div class="service borderline" v-if="data.typeId >= 3 && data.typeId <= 8">
      <div class="title">物流信息</div>
      <a-row class="info">
          <a-col :span="10" v-if="data.sendType == 0">
              亲自送样
          </a-col>
          <a-col :span="10" v-for="(item,index) in data.expresses" :key="index">
              <a-row type="flex">
                  <a-col class="status_title">{{item.flag == 0 ? '寄样' : '检测'}}物流单号：</a-col>
                  <a-col :span="15">{{item.expressNumber}}</a-col>
              </a-row>
              <a-row type="flex">
                  <a-col class="status_title">{{item.flag == 0 ? '物流' : '快递'}}公司：</a-col>
                  <a-col :span="15">{{item.expressCompany}}</a-col>
              </a-row>
          </a-col>
      </a-row>
    </div>
    <div class="service borderline history">
      <div class="title">操作历史</div>
      <a-timeline class="scrollbar">
        <a-timeline-item v-for="(item,index) in data.orderHistories" :key="index">
          <span>{{inspectors[item.operator]}}：</span>
          <span style="margin-left: 12px;">{{item.updateTime}}</span>
          <span style="margin-left: 16px;">{{orderHistoryText[item.typeId]}}</span>
        </a-timeline-item>
      </a-timeline>
    </div>
    <receipt-modal @confirm="fatherMethod" :visible.sync="showReceiptModel" :orderCode="data.orderCode" :paymentAmount="data.totalPrices" :orderId="data.id"></receipt-modal>
    <entrustModal :visible.sync="entrustVisible" :imgSrc="entrust" @confirm="getDownEntrust()"></entrustModal>
 </section>
 <section v-else>
    <noData> </noData>
  </section>
</template>
<script>
import { Modal } from 'ant-design-vue'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import receiptModal from '../components/receiptModal'
import entrustModal from '../components/entrustModal'
import noData from '../components/noData'
import loading from '../components/loading'  //loading
import {getiOrderDetails,downLoadReport,downEntrust,showEntrust} from '@/service/getData'
import {orderStatus,paymentTypes,isUrgent,inspectors,orderHistoryText,cancelReasonText} from '../api/dictionary'

export default {
  components: {
     receiptModal,entrustModal,noData,loading
  },
  data () {
    return {
      orderId: this.$route.params.id,  //暂时用id替代
      orderCode: '',
      status: '',
      fillModelById: 0,                //填写快递信息操作
      showAllProject: false,
      showAllProjectBtn: '查看所有项目',
      showReceiptModel: false,
      data: '',
      totalCommission: '',             //总佣金
      singleCommission: '',           //单个项目佣金
      orderAddress: '',               //收货人信息
      orderStatus: orderStatus,
      paymentTypes: paymentTypes,
      entrustVisible: false,
      entrust: '',
      isUrgent: isUrgent,
      commodityInfos: '',
      inspectors: inspectors,            //展示需求方或检测方
      orderHistoryText: orderHistoryText,  //展示操作历史文字
      countdown: true,
      countdownTime: '',
      cancelReasonText: cancelReasonText,
      loading: true,
    };
  },
  filters: {
    capitalizePay: function (paymentAmount,commissionRate) {
      if (!paymentAmount) return ''
      commissionRate = commissionRate/100;
      return (paymentAmount*commissionRate).toFixed(2);
    },
    capitalize: function (price,quantity) {
      if (!price) return ''
      return (price*quantity).toFixed(2);
    },
    capitalizeQuantity(commodityPrice,commodityQuantity,commissionRate){
      if (!commodityPrice) return ''
        commissionRate = commissionRate/100;
        return (commodityPrice*commodityQuantity*commissionRate).toFixed(2);
    }
  },
  methods: {
    fillCourierModal(id){
      this.showFillModel = true;
      this.fillModelById = id;
    },
    showAllProMethods(){
      if(this.showAllProject){
        this.showAllProject = false;
        this.showAllProjectBtn = '查看所有项目';
      }else{
        this.showAllProject = true;
        this.showAllProjectBtn = '收起所有项目';
      }
    },
    receipt(id){
      this.showReceiptModel = true;
    },
    getOrderDetailById(){
       getiOrderDetails(this.$route.params.id).then(res => {
          if(res && res.code == 200){
            if(res.data){
              this.data = res.data;
              this.commodityInfos = res.data.commodityInfos;
              this.orderAddress = res.data.orderAddress;
              this.orderCode = res.data.orderCode;
              this.loading = false;
              if(res.data.typeId == 7){
                this.countdown = true;
                this.goCountdown();
              }
            }else{
              this.data = '';
              this.loading = false;
            }
          }
       })
    },
    getDownLoadReport(){
       window.open(downLoadReport(this.orderId));
    },
    getDownEntrust(){
       window.open(downEntrust(this.orderCode));
    },
    showEntrust(){
      this.entrust = showEntrust(this.orderCode);
      this.entrustVisible = true;
    },
    fatherMethod() {
      this.getOrderDetailById();
    },
    goCountdown(){
      if(this.countdown){
        --this.data.min;
        if(!this.data.day){
          this.data.day = 0;
        }
        if(this.data.min < 0){
            --this.data.hour;
            this.data.min = 59;
        }
        if(this.data.hour < 0){
            --this.data.day;
            this.data.hour = 23;
        }
        if(this.data.day < 0){
            this.data.min = 0;
            this.data.hour = 0;
            this.data.day = 0;
        }
        this.countdownTime = this.data.day+"天"+this.data.hour+"时"+this.data.min+"分";
        setTimeout(this.goCountdown,60000);
      }
      if(this.data.min == 0 && this.data.hour == 0 && this.data.day == 0){
        this.countdown = false;
      }
    }
  },
  mounted(){
    this.getOrderDetailById();
  }
}
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateX(10px);
  opacity: 0;
}
p{
  margin: 0;
  bottom: 0;
}
.flexbox{
  display: flex;
}
.borderline{
  border-top: 8px solid #F2F2F2;
}
.container{
  background: #fff;
}
.top{
  padding: 0px 32px;
  font-size:16px;
  font-weight:500;
  color:rgba(0,0,0,0.65);
  line-height: 38px;
}
.top p span,.info p span{
  font-size:14px;
  font-weight:400;
  color:rgba(0,0,0,0.65);
  margin: 0px 132px 0px 41px;
}
.status{
  height: 135px;
  text-align: center;
  box-sizing: border-box;
  font-size: 18px;
}
.status-icon{
  margin-top: 24px;
}
.status-line{
  line-height: 83px;
}
.status-icon i,.status-icon span{
  margin-right: 20px;
  font-size: 24px;
  color: #52C41A;
  vertical-align: text-top;
}
.status button{
  height: 38px;
  margin-top: 20px;
  font-size: 16px;
}
.status-cause{
  margin-top: 10px;
  font-size: 14px;
}
.status-mar{
  margin-top: 45px;
}
.service{
  padding: 32px;
}
.title{
  height: 25px;
  padding-left: 10px;
  border-left: 3px solid rgba(4,79,232,1);
  font-size:20px;
  font-weight:600;
  color:rgba(0,0,0,0.65);
  line-height:28px;
}
.service-table{
  width: 100%;
  padding-left: 19px;
  margin-top: 25px;
  border:1px solid rgba(0,0,0,0.15);
  color:rgba(51,51,51,1);
}
.service-table thead{
  background:rgba(232,232,232,1);
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height: 38px;
}
.service-table tr{
  height: 47px;
  font-size:14px;
  font-weight:400;
  color:rgba(51,51,51,1);
}
.service-table tr td:first-child{
  padding: 0px 0px 0px 11px;
}
.service-name{
  padding: 6px 9px;
  background: rgba(243,243,243,1);
  border-radius: 2px;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 10px;
}
.info{
  margin-top: 34px;
  font-size:16px;
  font-weight:500;
  color:rgba(0,0,0,0.65);
  line-height: 38px;
}
.action-btn{
  margin-right: 20px;
  text-decoration: none;
}
.sample{
  text-align: center;
}
.sample .sample-info{
  margin: 35px 0px 50px 0px;
}
.sample .sample-info span:first-child{
  display: inline-block;
  width:22px;
  height:22px;
  margin-right: 16px;
  background:rgba(250,173,20,1);
  color: #fff;
  text-align: center;
  border-radius: 100%;
}
.sample .sample-info span:nth-child(2){
  font-size:16px;
  font-weight:500;
  color:rgba(0,0,0,0.85);
}
.service-allbtn{
  margin-top: -1px;
  margin-left: calc(50% - 116px);
  color: rgba(0,0,0,0.45);
  border: 1px solid rgba(217,217,216,1);
  border-top: 1px solid #fff;
  border-radius: 0;
}
.history .ant-timeline{
  height: 240px;
  margin-top: 32px;
  padding-top: 1px;
  overflow: auto;
}
.history >>> .ant-timeline-item-head{
    background: #d9d9d9;
    border-color: #d9d9d9;
}
.history >>> li:last-child .ant-timeline-item-head{
    background: #2300A8;
    border-color: #2300A8;
}
.history >>> .ant-timeline-item-content{
    padding-left: 32px;
}
.status_title{
  width: 7em;
}
</style>
