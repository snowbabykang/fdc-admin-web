<template>
<section>
    <section class="content-white-box">
        <a-form layout="inline">
            <a-form-item label="按月份搜索">
                <a-month-picker @change="onChange" :disabledDate="disabledDate" placeholder="日期" :getCalendarContainer="GLOBAL.getPopupContainer" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" ghost  @click="handleSubmit">查询</a-button>
            </a-form-item>
        </a-form>
    </section>
    <section class="content-white-box" style="margin: 0;padding-bottom: 0;">
        <section class="steplist">
            <router-link class="btn" :class="currentStep == 1 ? 'active' : ''" to="/settle">结算管理</router-link>
            <router-link class="btn" :class="currentStep == 2 ? 'active' : ''" to="/invoiceManage">发票管理</router-link>
        </section>
        <div class="alertinfobox">
            <div class="red">操作提示：</div>
            <ul>
                <li>·此处列出了平台每月的结算信息汇总，点击查看可以查看本月详细的店铺账单信息列表</li>
            </ul>
        </div>
    </section>
</section>
</template>
<script>
import moment from 'moment';
export default {
    name: 'settleInvoice',
    props: ['currentStep'],
    data() {
        return {
            current : this.currentStep,
            month : ''
        };
    },
    methods : {
        disabledDate(current) {
            return current < new Date('2019-1') || current > new Date('2020-1');
        },
        onChange(date, dateString) {
            if(date){
                this.month = dateString.replace('-','');
            }else{
                this.month = '';
            } 
        },
        handleSubmit(){
            this.$emit('search',this.month);  // 传递确认事件
        }
    }
};
</script>
<style scoped>

</style>