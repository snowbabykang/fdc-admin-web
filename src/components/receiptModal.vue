<template>
    <section>
        <a-modal
          centered
          :footer="null"
          :closable= "true"
          v-model="isvisible"
          :width="487"
          @cancel = "handleCancel()"
        >
            <div class="modal-content">
                <div class="order-num">
                  <span>订单编号：{{orderCode}}</span>
                  <span style="margin-left: 32px;">订单金额：￥{{paymentAmount}}</span>
                </div>
                <a-form :form="form" @submit="handleSubmit">
                  <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" label="付款时间">
                    <a-date-picker @change="onChange" v-decorator="['paymentTime',{rules: [{ required: true, message: '请选择付款时间' }]}]" style="width: 272px;margin-left: 32px;" />
                  </a-form-item>
                  <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" label="付款方式">
                    <a-select
                       :getPopupContainer="GLOBAL.getPopupContainer"
                      showSearch
                      placeholder="请选择"
                      optionFilterProp="children"
                      :filterOption="filterOption"
                      style="width: 272px;margin-left: 32px;"
                      @change="handleChange"
                      v-decorator="['paymentType',{rules: [{ required: true, message: '请选择付款方式' }]}]"
                    >
                      <a-select-option value="2">支付宝</a-select-option>
                      <a-select-option value="1">微信</a-select-option>
                      <a-select-option value="3">银联</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item :label-col="{ span: 4}" :wrapper-col="{ span: 8, offset: 10 }">
                    <a-button type="primary" ghost html-type="submit">
                      确定
                    </a-button>
                  </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </section>
</template>
<script>
import {getiOrderDetails,paymentDeal} from '@/service/getData'
export default {
    name: 'receiptModal',
    props: {
        visible: { type: Boolean, default: false },
        orderCode: '',
        paymentAmount: '',
        orderId: ''
    },
    data() {
        return {
          formLayout: 'horizontal',
          form: this.$form.createForm(this),
          iOrderDealPaymentFormBean:{
             iorderId: '',         //订单ID
             paymentTime: '',     //付款时间
             paymentType: '',      //付款方式
          }
        };
    },
    computed : {       //点击背景阴影隐藏model
        isvisible : {
            get: function () {
                return this.visible;
            },
            set: function () {

            }
        }
    },
    methods: {
        handleSubmit (e) {
          e.preventDefault();
          this.form.validateFields((err, values) => {
            if (!err) {
              this.paymentDealAction();
            }
          });
        },
        filterOption(input, option) {
          return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        handleCancel(){
            this.$emit('update:visible', false);    // 更新visible的值
            this.$emit('cancel');   // 传递取消事件
        },
        onChange(date, dateString) {
          this.iOrderDealPaymentFormBean.paymentTime = dateString;
        },
        handleChange (value) {
          console.log(`selected ${value}`);
          this.iOrderDealPaymentFormBean.paymentType = value;
        },
        paymentDealAction(){
          this.$set( this.iOrderDealPaymentFormBean, 'iorderId', this.orderId);
          paymentDeal(this.iOrderDealPaymentFormBean).then(res =>{
            if(res.code == 200){
               this.handleCancel();
               this.$emit('confirm');
            }
          })
        }
    },
    mounted(){

    }
}
</script>
<style scoped>
.modal-content{
  padding-bottom: 6px;
  height: 243px;
}
.order-num{
  margin-top: 10px;
  margin-bottom: 26px;
}
.order-pay{
  font-size:16px;
  font-weight:500;
}
.order-btn{
  margin-top: 64px;
}
.red{
  color: #E6242E;
}
.modal-content >>> .ant-form-explain{
  margin-left: 32px;
}
</style>
